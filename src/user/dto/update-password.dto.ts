import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8, { message: '密码长度不能小于 8 个字符' })
  oldPassword: string;
  @IsString()
  @MinLength(8, { message: '密码长度不能小于 8 个字符' })
  newPassword: string;
}
