import { Message } from "./message";

export type Discussion = {
  id: string;
  type: "PRIVATE" | "GROUP";
  name: string | null;
  lastMessageAt: string;
  messages: Message[];
  users: DiscussionUser[];
}

export type DiscussionUser = {
  discussionId: string;
  userId: string;
  user: {
    id: string;
    username: string;
  }
}