import { create } from 'zustand'

// Step 1 (client state): Zustand store for the selected user.
// No Provider needed: the store is just a hook.
export const useFilterStore = create((set) => ({
  userId: 1,
  setUserId: (userId) => set({ userId }),
}))
