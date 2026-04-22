import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor (private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto) {
    
    const user = await this.prisma.user.findUnique({
      where: {
        username: loginDto.username
      }
    });

    if(!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const { password, ...result } = user;
    return result;
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { username: registerDto.username }
        ]
      }
    });

    if (existing) {
      const field = existing.email === registerDto.email ? 'Email' : 'Username';
      throw new BadRequestException(`${field} already in use`);
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const {confirmation, ...userData} = registerDto;
    const created = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true
      }
    });

    // Automatically add the user to the general discussion
    const generalDiscussion = await this.prisma.discussion.findFirst({
      where: {
        type: "GENERAL"
      },

      select: {
        id: true
      }
    });

    if(generalDiscussion) {
      await this.prisma.discussionUsers.create({
        data: {
          userId: created.id,
          discussionId: generalDiscussion.id,
          canSeeOldMessages: true
        }
      })
    }


    return created;
  }

  async logout() {

  }
}