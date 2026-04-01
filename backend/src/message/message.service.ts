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

  async addReaction(messageId: string, userId: string, emoji: string) {
    try {
      const reaction = await this.prismaService.messageReaction.create({
        data: {
          messageId,
          userId,
          reaction: emoji
        },

        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });

      return {
        ...reaction
      };
    } catch (error) {
      console.error("Error adding reaction:", error);
      throw new InternalServerErrorException("Failed to add reaction", error);
    }
  }

  async removeReaction(messageId: string, userId: string, emoji: string) {
    try {
      const reaction = await this.prismaService.messageReaction.delete({
        where: {
          userId_messageId_reaction: {
            messageId,
            userId,
            reaction: emoji
          }
        },
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });

      return {
        ...reaction
      };
    } catch (error) {
      console.error("Error removing reaction:", error);
      throw new InternalServerErrorException("Failed to remove reaction", error);
    }
  }

}