import { Body, Controller, Patch, Put, Req, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dtos/update-profile.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { AuthenticationGuard } from "src/auth/auth.guard";

@Controller('/api/profile')
export class ProfileController{
  constructor(private readonly profileService: ProfileService){}

  @UseGuards(AuthenticationGuard)
  @Put('update-profile')
  async updateProfile(@Body() body: UpdateProfileDto, @Req() req: any){
    const userId = req.session.user.id;
    const updated = await this.profileService.updateProfile(body, userId);
    req.session.user = { ...req.session.user, ...updated };
    return {
      message: "Profile updated successfully",
      user: updated
    }
  }

  @UseGuards(AuthenticationGuard)
  @Patch('update-password')
  async updatePassword(@Body() body: ChangePasswordDto, @Req() req: any){
    const userId = req.session.user.id;
    return await this.profileService.updatePassword(body, userId);
  }

}