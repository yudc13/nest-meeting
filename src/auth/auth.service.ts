import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { HashingService } from '../hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    const isEqual = await this.hashingService.compare(password, user.password);
    if (!isEqual) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    const accessToken = await this.generateToken(user);
    return {
      accessToken,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const isExist = await this.userService.findUserByEmail(createUserDto.email);
    if (isExist) {
      throw new ConflictException('邮箱已被注册');
    }
    return this.userService.create(createUserDto);
  }

  async generateToken(user: User) {
    return await this.jwtService.signAsync(
      { userId: user.id, email: user.email },
      {
        secret: process.env.JWT_SECRET,
      },
    );
  }
}
