import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY, RequestUser } from '../constant/jwt.constant';

export const User = createParamDecorator(
  (key: keyof RequestUser, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req[REQUEST_USER_KEY];
    return user ? (key ? user[key] : user) : null;
  },
);
