import { Body, Controller, Delete, Get, Post, Req, UseGuards } from "@nestjs/common";
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

    const loggedInUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      usernameColor: user.usernameColor
    }

    req.session.user = { ...loggedInUser }

    return {
      message: "Login successful",
      user: { ...loggedInUser }
    }
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  async me(@Req() req: any) {
    return {
      user: req.session.user
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