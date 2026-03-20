import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { DiscussionService } from "./discussion.service";
import type { CreatePrivateDiscussionDto } from "./dtos/create-private.dto";
import type { CreateGroupDiscussionDto } from "./dtos/create-group.dto";
import { AuthenticationGuard } from "src/auth/auth.guard";

@UseGuards(AuthenticationGuard)
@Controller("/api/discussions")
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Post('create-private')
  async createDiscussion(@Req() req: any, @Body() createPrivateDiscussionDto: CreatePrivateDiscussionDto) {
    const authUserId = req.session.user.id;
    return this.discussionService.createPrivateDiscussion(authUserId, createPrivateDiscussionDto);
  }

  @Post('create-group')
  async createGroupDiscussion(@Req() req: any, @Body() createGroupDiscussionDto: CreateGroupDiscussionDto) {
    const authUserId = req.session.user.id;
    return this.discussionService.createGroupDiscussion(authUserId, createGroupDiscussionDto);
  }

  @Get('me')
  async getUserDiscussions(@Req() req: any) {
    const authUserId = req.session.user.id;
    return this.discussionService.getUserDiscussions(authUserId);
  }

  @Get(':id')
  async getDiscussion(@Req() req: any, @Param('id') discussionId: string) {
    const userId = req.session.user.id;
    return this.discussionService.getDiscussion(discussionId, userId);
  }
}