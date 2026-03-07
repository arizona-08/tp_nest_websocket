import { create } from "zustand"

interface BurgerMenuState {
  isOpen: boolean
  toggleMenu: () => void
}

export const useBurgerMenuStore = create<BurgerMenuState>((set) => ({
  isOpen: false,
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
}))