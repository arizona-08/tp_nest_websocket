import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { DiscussionService } from "./discussion.service";
import type { CreatePrivateDiscussionDto } from "./dtos/create-private.dto";
import type { CreateGroupDiscussionDto } from "./dtos/create-group.dto";
import { AuthenticationGuard } from "src/auth/auth.guard";

@UseGuards(AuthenticationGuard)
@Controller("/api/discussions")
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Post('create-private')
  async createDiscussion(@Body() createPrivateDiscussionDto: CreatePrivateDiscussionDto) {

  }

  @Post('create-group')
  async createGroupDiscussion(@Body() createGroupDiscussionDto: CreateGroupDiscussionDto) {

  }
}