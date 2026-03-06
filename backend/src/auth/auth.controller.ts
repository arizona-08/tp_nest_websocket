import { Body, Controller, Delete, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { request } from "http";
import { AuthenticationGuard } from "./auth.guard";

@Controller('api/auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    const user = await this.authService.login(loginDto);

    req.session.user = {
      id: user.id,
      username: user.username
    }

    return {
      message: "Login successful",
      user: {
        username: user.username,
      }
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto){
   const user = await this.authService.register(registerDto);
   return { message: "User registered successfully", user };
  }

  @UseGuards(AuthenticationGuard)
  @Delete('logout')
  async logout(@Req() req: any) {
    req.session.destroy();
    return {
      message: "Logout successful"
    }
  }
}