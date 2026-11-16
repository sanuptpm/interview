import { useSyncExternalStore } from 'react'
import {
  getAllHighlights,
  mergeHighlights,
  replaceAllHighlights,
  subscribeHighlights,
} from './highlights.js'

// Sync highlights to Firebase (Google sign-in + Firestore), so they follow the user
// to every device. Each user has one document: highlights/{uid} = { data: JSON, updatedAt }.
// Without the VITE_FIREBASE_* settings (see .env.example) the site works as before,
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
  const parse = (snap) => {
    try {
      return JSON.parse(snap.data()?.data || '{}')
    } catch {
      return {}
    }
  }

  // 1. First sign-in on this device: keep both this browser's and the cloud's highlights
  const first = await fb.store.getDoc(ref)
  const merged = mergeHighlights(parse(first), getAllHighlights())
  let lastJson = JSON.stringify(merged)
  replaceAllHighlights(merged)

  let timer
  const write = (json) => {
    setState({ sync: 'saving' })
    fb.store
      .setDoc(ref, { data: json, updatedAt: fb.store.serverTimestamp() })
      .then(() => setState({ sync: 'saved', error: '' }))
      .catch((error) => setState({ sync: 'error', error: error.code || error.message }))
  }
  if (lastJson !== (first.data()?.data || '{}')) write(lastJson)

  // 2. Changes from other devices replace the local copy (deletes sync too)
  const stopCloud = fb.store.onSnapshot(ref, (snap) => {
    if (snap.metadata.hasPendingWrites) return
    const json = snap.data()?.data || '{}'
    if (json === lastJson) return
    lastJson = json
    replaceAllHighlights(parse(snap))
  })

  // 3. Changes made here are saved to the cloud (batched for 800 ms)
  const stopLocal = subscribeHighlights(() => {
    const json = JSON.stringify(getAllHighlights())
    if (json === lastJson) return
    lastJson = json
    setState({ sync: 'saving' })
    clearTimeout(timer)
    timer = setTimeout(() => write(json), 800)
  })

  return () => {
    clearTimeout(timer)
    stopCloud()
    stopLocal()
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
