import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { HashingModule } from './hashing/hashing.module';
import { BcryptService } from './bcrypt/bcrypt.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guard/access-token.guard';
import { JwtMiddleware } from './common/middleware/jwt.middleware';
import { RoomModule } from './room/room.module';
import { MeetingModule } from './meeting/meeting.module';
import { GatewayModule } from './gateway/gateway.module';
import { ChatModule } from './chat/chat.module';
import { LogInterceptor } from './common/interceptor/log.interceptor';
import { LoggerModule } from './logger/logger.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    HashingModule,
    AuthModule,
    RoomModule,
    MeetingModule,
    GatewayModule,
    ChatModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BcryptService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
