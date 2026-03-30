export type Message = {
  id: string;
  content: string;
  authorId: string;
  discussionId: string;
  sendedAt: string;
  author?: {
    id: string;
    username: string;
    usernameColor: string;
  }
}