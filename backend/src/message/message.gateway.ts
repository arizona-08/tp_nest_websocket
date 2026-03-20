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
      client.to(data.discussionId).emit('receive_message', {...data, id: savedMessage.id, sendedAt: savedMessage.sendedAt});
      return data;
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

  
}