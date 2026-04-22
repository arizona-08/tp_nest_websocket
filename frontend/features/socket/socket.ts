import { Discussion } from "@/types/discussion";
import { MessageReaction } from "@/types/message";
import { io, Socket } from "socket.io-client";

export type MessageData = {
  content: string;
  authorId: string;
}
export class MessageSocketService {
  private socket: Socket | null = null;
  
  connect() {
    if(!this.socket && typeof window !== 'undefined') {
      this.socket = io(
        process.env.NEXT_PUBLIC_BACKEND_URL ,
        {
          transports: ['websocket'],
          withCredentials: true,
        }
      );
    }
  }

  joinDiscussion(discussionId: string) {
    this.socket?.emit('join_discussion', discussionId);
  }

  leaveDiscussion(discussionId: string) {
    this.socket?.emit('leave_discussion', discussionId);
  }

  sendMessage(dataToSend: MessageData, discussionId: string) {
    this.socket?.emit('send_message', { ...dataToSend, discussionId });
  }

  onMessage(callback: (message: any) => void) {
    this.socket?.on('receive_message', callback);

    return () => {
      this.socket?.off('receive_message', callback);
    }
  }

  createDiscussionOnFirstMessage(discussionId: string) {
    this.socket?.emit('create_discussion_on_first_message', { discussionId });
  }

  onDiscussionCreatedOnFirstMessage(callback: (discussionData: Discussion) => void){
    this.socket?.on('discussion_created_on_first_message', callback);

    return () => {
      this.socket?.off('discussion_created_on_first_message', callback);
    }
  }

  isTyping(username: any, discussionId: string) {
    this.socket?.emit('is_typing', { username, discussionId });
  }

  stopTyping(username: any, discussionId: string) {
    this.socket?.emit('stop_typing', { username, discussionId });
  }

  onUserTyping(callback: (data: any) => void) {
    this.socket?.on('user_typing', callback);

    return () => {
      this.socket?.off('user_typing', callback);
    }
  }

  onUserStopTyping(callback: (data: any) => void) {
    this.socket?.on('user_stop_typing', callback);

    return () => {
      this.socket?.off('user_stop_typing', callback);
    }
  }

  addReaction(data: {
    user: {
      id: string,
      username: string,
    },
    messageId: string,
    emoji: string,
    discussionId: string
  }) {
    this.socket?.emit('add_reaction', data);
  }

  onReactionAdded(callback: (data: MessageReaction) => void) {
    this.socket?.on('reaction_added', callback);

    return () => {
      this.socket?.off('reaction_added', callback);
    }
  }

  removeReaction(data: {
    user: {
      id: string,
      username: string,
    },
    messageId: string,
    emoji: string,
    discussionId: string
  }) {
    this.socket?.emit('remove_reaction', data);
  }

  onReactionRemoved(callback: (data: MessageReaction) => void) {
    this.socket?.on('reaction_removed', callback);

    return () => {
      this.socket?.off('reaction_removed', callback);
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const messageSocketService = new MessageSocketService();