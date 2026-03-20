import { create } from "zustand";

type AddUserModalStoreType = {
  isAddUserModalOpen: boolean;
  openAddUserModal: () => void;
  closeAddUserModal: () => void;
}

export const useAddUserModalStore = create<AddUserModalStoreType>((set) => ({
  isAddUserModalOpen: false,
  openAddUserModal: () => set({ isAddUserModalOpen: true }),
  closeAddUserModal: () => set({ isAddUserModalOpen: false }),
}));