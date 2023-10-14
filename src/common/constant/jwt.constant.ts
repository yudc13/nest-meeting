export const REQUEST_USER_KEY = 'user';

export interface RequestUser {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}
