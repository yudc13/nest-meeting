import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: '请输入合法的邮箱' })
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: '密码长度不能小于 8 个字符' })
  password: string;
  @IsString()
  @IsOptional()
  nickname?: string;
  @IsString()
  @IsOptional()
  avatar?: string;
}
