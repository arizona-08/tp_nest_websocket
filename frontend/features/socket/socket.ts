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

  sendMessage(dataToSend: MessageData, discussionId: string) {
    this.socket?.emit('send_message', { ...dataToSend, discussionId });
  }

  onMessage(callback: (message: any) => void) {
    this.socket?.on('receive_message', callback);

    return () => {
      this.socket?.off('receive_message', callback);
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const messageSocketService = new MessageSocketService();