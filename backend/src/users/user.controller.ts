import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthenticationGuard } from "src/auth/auth.guard";

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService){}

  @UseGuards(AuthenticationGuard)
  @Get("search")
  async searchUsers(@Query("query") query: string) {
    return this.userService.searchUsers(query);
  }
}