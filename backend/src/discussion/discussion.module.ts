import { Module } from "@nestjs/common";
import { DiscussionController } from "./discussion.controller";
import { DiscussionService } from "./discussion.service";
import { PrismaModule } from "src/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [DiscussionController],
  providers: [DiscussionService],
  exports: [DiscussionService]
})
export class DiscussionModule {}