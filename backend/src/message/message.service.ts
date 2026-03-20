import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class MessageService {
  constructor (private readonly prismaService: PrismaService) {}

  async saveMessage(discussionId: string, authorId: string, content: string) {
    try{
      const message = await this.prismaService.message.create({
        data: {
          content,
          authorId,
          discussionId,
          sendedAt: new Date()
        }
      })
  
      return message;
    } catch (error) {
      throw new InternalServerErrorException("Failed to save message", error.message);
    }
  }

  // async getMessagesByDiscussionId(discussionId: string) {
  //   try {
  //     const messages = await this.prismaService.message.findMany({
  //       where: { discussionId },
  //       orderBy: { sendedAt: 'asc' }
  //     });

  //     return messages;
  //   } catch (error) {
  //     throw new InternalServerErrorException("Failed to retrieve messages", error.message);
  //   }
  // }
}