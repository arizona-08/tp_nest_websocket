import { create } from "zustand";

interface DiscussionListState {
  isDiscussionListOpen: boolean;
  activeDiscussion: {
    id: string;
    name: string;
  }
  setActiveDiscussion: (discussion: { id: string; name: string }) => void;
  open: () => void;
  close: () => void;
}
export const useDiscussionListStore = create<DiscussionListState>()((set) => ({
  isDiscussionListOpen: false,
  activeDiscussion: {
    id: "",
    name: ""
  },
  setActiveDiscussion: (discussion: { id: string; name: string }) => set({ activeDiscussion: discussion }),
  open: () => set({ isDiscussionListOpen: true }),
  close: () => set({ isDiscussionListOpen: false }),
}))