import { Module } from "@nestjs/common";
import { MessageGateway } from "./message.gateway";
import { MessageService } from "./message.service";
import { PrismaModule } from "src/prisma.module";
import { DiscussionModule } from "src/discussion/discussion.module";

@Module({
  imports: [PrismaModule, DiscussionModule],
  providers: [MessageGateway, MessageService],
  exports: [MessageService]
})
export class MessageModule {}