export type Message = {
  id: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    usernameColor: string;
  }
  discussionId: string;
  sendedAt: string;
  reactions: MessageReaction[];
}

export type MessageReaction = {
  id: string;
  messageId: string;
  user: {
    id: string;
    username: string;
  };
  reaction: string;
}