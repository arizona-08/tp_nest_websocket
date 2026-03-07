import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UpdateProfileDto } from "./dtos/update-profile.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService){}

  async updateProfile(data: UpdateProfileDto, userId: string){
    const { username, email, usernameColor } = data;

    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ],
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException("Cet email est déjà utilisé par un autre compte.");
      }
      if (existingUser.username === username) {
        throw new ConflictException("Ce nom d'utilisateur est déjà pris.");
      }
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        usernameColor,
      },
    });

    const {password, createdAt, updatedAt, ...result} = updatedUser;
    return result;
  }

  async updatePassword(data: ChangePasswordDto, userId: string){
    const { currentPassword, newPassword } = data;

    const user = await this.prismaService.user.findUnique({
      select: { password: true },
      where: { id: userId }
    });

    if(!user) {
      throw new NotFoundException("User not found");
    }

    const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if(!isCurrentPasswordMatch) {
      throw new ConflictException("Le mot de passe actuel est incorrect.");
    }

    const isNewPasswordSameAsCurrent = await bcrypt.compare(newPassword, user.password);

    if(isNewPasswordSameAsCurrent) {
      throw new ConflictException("Le nouveau mot de passe doit être différent de l'actuel.");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return { message: "Mot de passe mis à jour avec succès" };
  }
}