import { create } from "zustand";

interface DiscussionListState {
  isDiscussionListOpen: boolean;
  activeDiscussionId: string | null;
  open: () => void;
  close: (discussionId: string) => void;
}
export const useDiscussionListStore = create<DiscussionListState>()((set) => ({
  isDiscussionListOpen: false,
  activeDiscussionId: null,
  open: () => set({ isDiscussionListOpen: true, activeDiscussionId: null }),
  close: (discussionId: string) => set({ isDiscussionListOpen: false, activeDiscussionId: discussionId }),
}))