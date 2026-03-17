import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService){}

  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        username: true,
      }
    });
  }
}