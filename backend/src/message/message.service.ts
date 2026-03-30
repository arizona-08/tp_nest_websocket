import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class MessageService {
  constructor (private readonly prismaService: PrismaService) {}

  private async assertUserInDiscussion(userId: string, discussionId: string) {
    const membership = await this.prismaService.discussionUsers.findUnique({
      where: {
        discussionId_userId: {
          discussionId,
          userId
        }
      }
    });
  }

  async saveMessage(discussionId: string, authorId: string, content: string) {
    try{

      await this.assertUserInDiscussion(authorId, discussionId);  
      const message = await this.prismaService.message.create({
        data: {
          content,
          authorId,
          discussionId,
          sendedAt: new Date()
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              usernameColor: true
            }
          }
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