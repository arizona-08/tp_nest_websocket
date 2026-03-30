import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreatePrivateDiscussionDto } from "./dtos/create-private.dto";
import { CreateGroupDiscussionDto } from "./dtos/create-group.dto";

@Injectable()
export class DiscussionService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPrivateDiscussion(authUserId: string, { userId }: CreatePrivateDiscussionDto) {

    const existing = await this.prismaService.discussion.findFirst({
      where: {
        type: "PRIVATE",
        AND: [
          { users: { some: { userId: authUserId } } },
          { users: { some: { userId: userId } } }
        ]
      }
    });

    if (existing) {
      return existing;
    }


    const discussion = await this.prismaService.discussion.create({
      data: {
        type: "PRIVATE",
        users: {
          create: [
            { user: {connect: { id: authUserId }} },
            { user: {connect: { id: userId }} }
          ]
        }
      },
      include: { users: true }
      
    })

    return discussion;
  }

  async createGroupDiscussion(authUserId: string, {name, userIds, historyMode}: CreateGroupDiscussionDto) {
    const memberIds = Array.from(new Set([...userIds, authUserId]));

    const discussion = await this.prismaService.discussion.create({
      data: {
        type: "GROUP",
        name: name.trim(),
        users: {
          create: memberIds.map((userId) => ({
            user: {
              connect: { id: userId }
            },
            canSeeOldMessages: userId === authUserId ? true : historyMode === "all"
          }))
        }
      },
      include: { users: true }
    })

    return discussion;
  }

  async getUserDiscussions(authUserId: string) {
    const discussions = await this.prismaService.discussion.findMany({
      where: {
        users: {
          some: { userId: authUserId }
        }
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        messages: {
          orderBy: { sendedAt: "desc" },
          take: 1,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                usernameColor: true
              }
            }
          }
        }
      }
    });

    return discussions;
  }

  async getDiscussion(discussionId: string, userId: string) {
    const discussionUser = await this.prismaService.discussionUsers.findUnique({
      where: {
        discussionId_userId: {
          discussionId,
          userId
        }
      }
    });

    if (!discussionUser) {
      return null;
    }

    const discussion = await this.prismaService.discussion.findUnique({
      where: { 
        id: discussionId,
        users: {
          some: { userId }
        }
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },

        messages: {
          where: discussionUser.canSeeOldMessages 
          ? undefined
          : { sendedAt: { gte: discussionUser.joinedAt } },
          orderBy: { sendedAt: "asc" },
          include: { author: {
            select: {
              id: true,
              username: true,
              usernameColor: true
            }
          } } 
        }
      }
    });

    return discussion;
  }
}