import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  email: string;
  @Exclude()
  password: string;
  nickname: string;
  avatar: string;
  createAt: Date;
  updateAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
