import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { MessageService } from "./message.service";
import { Server } from "socket.io";

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

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() data: any){
    const savedMessage = await this.messageService.saveMessage(data.discussionId, data.authorId, data.content);
    this.server.emit('receive_message', {...data, id: savedMessage.id});
    return data;
  }

  @SubscribeMessage('receive_message')
  async receiveMessage(@MessageBody() data: any){
    return data;
  }
}