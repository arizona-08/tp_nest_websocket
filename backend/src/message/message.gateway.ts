import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { MessageService } from "./message.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class MessageGateway {

  @WebSocketServer() server: Server;
  constructor (private readonly messageService: MessageService){}

  @SubscribeMessage('join_discussion')
  handleJoinRoom(@MessageBody() discussionId: string, @ConnectedSocket() client: Socket) {
    client.join(discussionId);
    console.log(`Le client ${client.id} a rejoint la discussion ${discussionId}`);
  }

  @SubscribeMessage('leave_discussion')
  handleLeaveRoom(@MessageBody() discussionId: string, @ConnectedSocket() client: Socket) {
    client.leave(discussionId);
    console.log(`Le client ${client.id} a quitté la discussion ${discussionId}`);
  }

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket){
    try{
      const savedMessage = await this.messageService.saveMessage(data.discussionId, data.authorId, data.content);
      client.to(data.discussionId).emit('receive_message', {...data, id: savedMessage.id, content: savedMessage.content, authorId: savedMessage.authorId, discussionId: savedMessage.discussionId, sendedAt: savedMessage.sendedAt, author: savedMessage.author });
      return savedMessage;
    } catch (error) {
      console.error("Error sending message:", error);
    }
    
  }

  @SubscribeMessage('receive_message')
  async receiveMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket){
    return data;
  }

  @SubscribeMessage("is_typing")
  async isTyping(@MessageBody() data: { username: string; discussionId: string }, @ConnectedSocket() client: Socket) {
    client.to(data.discussionId).emit("user_typing", data);
    return data;
  }

  @SubscribeMessage("stop_typing")
  async stopTyping(@MessageBody() data: { username: string; discussionId: string }, @ConnectedSocket() client: Socket) {
    client.to(data.discussionId).emit("user_stop_typing", data);
    return data;
  }

  @SubscribeMessage("add_reaction")
  async addReaction(@MessageBody() data: {
    user: {
      id: string,
      username: string,
    }
    messageId: string;
    emoji: string;
    discussionId: string }, 
    @ConnectedSocket() client: Socket
  ) {
    const reaction =await this.messageService.addReaction(data.messageId, data.user.id, data.emoji);
    client.to(data.discussionId).emit("reaction_added", reaction);
    return data;
  }

  @SubscribeMessage("remove_reaction")
  async removeReaction(@MessageBody() data: {
    user: {
      id: string,
      username: string,
    }
    messageId: string;
    emoji: string;
    discussionId: string }, 
    @ConnectedSocket() client: Socket
  ) {
    const reaction =await this.messageService.removeReaction(data.messageId, data.user.id, data.emoji);
    client.to(data.discussionId).emit("reaction_removed", reaction);
    return data;
  }
  
}