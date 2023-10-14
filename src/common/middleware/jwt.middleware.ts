import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { REQUEST_USER_KEY, RequestUser } from '../constant/jwt.constant';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const [_, token] = req.headers.authorization?.split(' ') ?? [];
    req[REQUEST_USER_KEY] = this.jwtService.decode(token) as RequestUser;
    next();
  }
}
