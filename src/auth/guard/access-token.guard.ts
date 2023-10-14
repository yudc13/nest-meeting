import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../decorator/auth.decorator';
import { AuthTypeEnum } from '../enum/auth-type.enum';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const authTypes = this.reflector.getAllAndOverride<AuthTypeEnum[]>(
        AUTH_TYPE_KEY,
        [context.getHandler(), context.getClass()],
      );
      const isPublic = authTypes?.every((type) => type === AuthTypeEnum.None);
      if (isPublic) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const [, token] = request.headers['authorization']?.split(' ') ?? [];
      if (!token) {
        throw new UnauthorizedException('签名不存在');
      }
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('签名失效, 请登录');
    }
    return true;
  }
}
