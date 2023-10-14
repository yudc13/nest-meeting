import { SetMetadata } from '@nestjs/common';
import { AuthTypeEnum } from '../enum/auth-type.enum';

export const AUTH_TYPE_KEY = 'authType';

export const Auth = (...args: AuthTypeEnum[]) =>
  SetMetadata(AUTH_TYPE_KEY, args);
