import { Module } from "@nestjs/common";
import { MessageGateway } from "./message.gateway";
import { MessageService } from "./message.service";
import { PrismaModule } from "src/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [MessageGateway, MessageService],
  exports: [MessageService]
})
export class MessageModule {}