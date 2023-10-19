import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from '../common/decorator/user.decorator';
import { Log, LOG_ACTION } from '../common/decorator/log.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserInfo(@User('userId') userId: number) {
    const user = await this.userService.findUserById(userId);
    return new UserEntity(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async findUserList(@Body() queryUserDto: QueryUserDto) {
    const result = await this.userService.getUserListByPage(queryUserDto);
    return {
      total: result.total,
      list: result.list.map((u) => new UserEntity(u)),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return new UserEntity(user);
  }

  @Put(':userId')
  @Log(LOG_ACTION.UPDATE, `编辑用户：`, {
    userId: '用户ID',
    nickname: '用户昵称',
    email: '用户邮箱',
  })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId') userId: number,
  ) {
    const user = await this.userService.updateUser(userId, updateUserDto);
    return new UserEntity(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':userId')
  async updateUserPassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('userId') userId: number,
  ) {
    const user = await this.userService.updateUserPassword(
      userId,
      updatePasswordDto,
    );
    return new UserEntity(user);
  }
}
