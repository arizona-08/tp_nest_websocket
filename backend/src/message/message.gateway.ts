import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { MessageService } from "./message.service";
import { Server, Socket } from "socket.io";
import { DiscussionService } from "src/discussion/discussion.service";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class MessageGateway {

  @WebSocketServer() server: Server;
  constructor (
    private readonly messageService: MessageService,
    private readonly discussionService: DiscussionService
  ){}

  @SubscribeMessage('join_discussion')
  handleJoinRoom(@MessageBody() discussionId: string, @ConnectedSocket() client: Socket) {
    client.join(discussionId);
  }

  @SubscribeMessage('leave_discussion')
  handleLeaveRoom(@MessageBody() discussionId: string, @ConnectedSocket() client: Socket) {
    client.leave(discussionId);
  }

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket){
    try{
      const savedMessage = await this.messageService.saveMessage(data.discussionId, data.authorId, data.content);

        // sender
      client.emit('receive_message', savedMessage);

      // autres membres de la room
      client.to(data.discussionId).emit('receive_message', {
        ...data,
        id: savedMessage.id,
        content: savedMessage.content,
        authorId: savedMessage.authorId,
        discussionId: savedMessage.discussionId,
        sendedAt: savedMessage.sendedAt,
        author: savedMessage.author }
      );

      return savedMessage;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  @SubscribeMessage('receive_message')
  async receiveMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket){
    return data;
  }

  @SubscribeMessage('create_user_global_room')
  async createUserGlobalRoom(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    client.join(`user_${data.userId}`);
  }

  @SubscribeMessage('create_discussion_on_first_message')
  async createDiscussionOnFirstMessage(@MessageBody() data: { discussionId: string, currentUserId: string }, @ConnectedSocket() client: Socket) {
    const discussion = await this.discussionService.getDiscussionOnFirstMessage(data.discussionId);

    discussion.users.forEach(user => {
      if (user.user.id !== data.currentUserId) {
        this.server.to(`user_${user.user.id}`).emit('discussion_created_on_first_message', discussion);
      }
    });

    return discussion;
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