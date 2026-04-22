import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { ProfileModule } from './profile/profile.module';
import { MessageModule } from './message/message.module';
import { DiscussionModule } from './discussion/discussion.module';
import { UserModule } from './users/user.module';
import { DiscussionService } from './discussion/discussion.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    PrismaModule,
    ProfileModule,
    MessageModule,
    DiscussionModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
 
})
export class AppModule implements OnModuleInit {
  constructor(private discussionService: DiscussionService) {}

  async onModuleInit() {
    await this.discussionService.createGeneralDiscussion();
  }
}
