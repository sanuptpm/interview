import { useSyncExternalStore } from 'react'
import {
  getAllHighlights,
  getHighlightsLocked,
  mergeHighlights,
  replaceAllHighlights,
  setHighlightsLocked,
  subscribeHighlights,
  subscribeHighlightsLock,
} from './highlights.js'

// Sync highlights to Firebase (Google sign-in + Firestore), so they follow the user
// to every device. Each user has one document:
// highlights/{uid} = { data: JSON string of { v: 2, locked, highlights }, updatedAt }.
// Settings come from react/.env. Without them the site works as before,
// with highlights saved only in this browser.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
export const cloudEnabled = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId)

// { status: 'off' | 'loading' | 'signed-out' | 'signed-in', user, sync: 'saved' | 'saving' | 'error', error }
let state = { status: cloudEnabled ? 'loading' : 'off', user: null, sync: 'saved', error: '' }
const listeners = new Set()
const setState = (patch) => {
  state = { ...state, ...patch }
  listeners.forEach((listener) => listener())
}
const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const useCloud = () => useSyncExternalStore(subscribe, () => state)

// Firebase is loaded only when it is configured, in its own chunk
let firebase
async function load() {
  if (!firebase) {
    firebase = Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/firestore')]).then(
      ([app, auth, store]) => {
        const instance = app.initializeApp(config)
        return { auth, store, authApi: auth.getAuth(instance), db: store.getFirestore(instance) }
      }
    )
  }
  return firebase
}

let stopSync = () => {}

async function startSync(fb, user) {
  const ref = fb.store.doc(fb.db, 'highlights', user.uid)

  // The cloud copy keeps the lock inside the `data` text, next to the highlights:
  // data = '{"v":2,"locked":true,"highlights":{...}}'. Older copies hold only the highlights.
  const parse = (snap) => {
    try {
      const raw = JSON.parse(snap.data()?.data || '{}')
      if (raw?.v === 2) return { highlights: raw.highlights || {}, locked: raw.locked }
      return { highlights: raw || {}, locked: undefined }
    } catch {
      return { highlights: {}, locked: undefined }
    }
  }
  const serialize = () => JSON.stringify({ v: 2, locked: getHighlightsLocked(), highlights: getAllHighlights() })

  // 1. First sign-in on this device: keep both this browser's and the cloud's highlights.
  //    The account's lock wins when it has one; otherwise this browser's choice is saved.
  const first = await fb.store.getDoc(ref)
  const cloud = parse(first)
  let applying = true
  replaceAllHighlights(mergeHighlights(cloud.highlights, getAllHighlights()))
  if (typeof cloud.locked === 'boolean') setHighlightsLocked(cloud.locked)
  applying = false
  let lastJson = serialize()

  let timer
  const write = (json) => {
    setState({ sync: 'saving' })
    fb.store
      .setDoc(ref, { data: json, updatedAt: fb.store.serverTimestamp() })
      .then(() => setState({ sync: 'saved', error: '' }))
      .catch((error) => setState({ sync: 'error', error: error.code || error.message }))
  }
  if (lastJson !== (first.data()?.data || '{}')) write(lastJson)

  // 2. Changes from other devices replace the local copy (deletes and lock changes sync too)
  const stopCloud = fb.store.onSnapshot(ref, (snap) => {
    if (snap.metadata.hasPendingWrites) return
    const json = snap.data()?.data || '{}'
    if (json === lastJson) return
    const next = parse(snap)
    applying = true
    if (typeof next.locked === 'boolean') setHighlightsLocked(next.locked)
    replaceAllHighlights(next.highlights)
    applying = false
    lastJson = serialize()
  })

  // 3. Changes made here (highlights or the lock) are saved to the cloud (batched for 800 ms)
  const onLocalChange = () => {
    if (applying) return
    const json = serialize()
    if (json === lastJson) return
    lastJson = json
    setState({ sync: 'saving' })
    clearTimeout(timer)
    timer = setTimeout(() => write(json), 800)
  }
  const stopLocal = subscribeHighlights(onLocalChange)
  const stopLock = subscribeHighlightsLock(onLocalChange)

  return () => {
    clearTimeout(timer)
    stopCloud()
    stopLocal()
    stopLock()
  }
}

let started = false
export async function startCloud() {
  if (!cloudEnabled || started) return
  started = true
  try {
    const fb = await load()
    fb.auth.onAuthStateChanged(fb.authApi, async (user) => {
      stopSync()
      stopSync = () => {}
      if (!user) return setState({ status: 'signed-out', user: null, sync: 'saved' })
      setState({
        status: 'signed-in',
        user: { name: user.displayName || user.email, email: user.email, photo: user.photoURL },
        sync: 'saving',
      })
      try {
        stopSync = await startSync(fb, user)
        setState({ sync: 'saved', error: '' })
      } catch (error) {
        setState({ sync: 'error', error: error.code || error.message })
      }
    })
  } catch (error) {
    setState({ status: 'signed-out', error: error.message })
  }
}

export async function signIn() {
  const fb = await load()
  const provider = new fb.auth.GoogleAuthProvider()
  try {
    await fb.auth.signInWithPopup(fb.authApi, provider)
  } catch (error) {
    if (error.code === 'auth/popup-blocked') return fb.auth.signInWithRedirect(fb.authApi, provider)
    if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
      setState({ error: error.code || error.message })
    }
  }
}

// Highlights stay in this browser after signing out
export async function signOut() {
  const fb = await load()
  await fb.auth.signOut(fb.authApi)
}
