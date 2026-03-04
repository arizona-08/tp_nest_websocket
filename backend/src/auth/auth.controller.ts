import { Controller, Delete, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login() {
    await this.authService.login();
  }

  @Post('register')
  async register(){
    await this.authService.register();
  }

  @Delete('logout')
  async logout() {
    await this.authService.logout();

  }
}