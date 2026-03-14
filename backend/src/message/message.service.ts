import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class MessageService {
  constructor (private readonly prismaService: PrismaService) {}
}