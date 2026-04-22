import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaService } from './prisma.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  app.use(
    session({
      secret: process.env.APP_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
      store: new PrismaSessionStore(
        prismaService,
        {
          checkPeriod: 2 * 60 * 1000,  // nettoie les sessions expirées toutes les 2 min
          dbRecordIdIsSessionId: true,
        }
      ),
    }),
  )
  await app.listen(process.env.APP_PORT ?? 3000);

  // @ts-ignore
  // console.log(prisma);
}
bootstrap();
