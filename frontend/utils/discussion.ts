import { Discussion } from "@/types/discussion";

export function formatDiscussionName(discussion: Discussion, authUserId: string): string {
  if (discussion.type === "PRIVATE") {
    const otherUser = discussion.users.find((user) => user.userId !== authUserId);
    return otherUser ? otherUser.user.username : "Unknown User";
  }
  return discussion.name;
}