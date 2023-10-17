import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { HashingService } from '../hashing/hashing.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { genUserAvatar, genUserNickname, getPageParams } from '../utils';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  /**
   * 分页获取用户列表
   * @param queryUserDto
   */
  async getUserListByPage(queryUserDto: QueryUserDto) {
    const { pageSize, current, email, nickname, createAt, updateAt, sort } =
      queryUserDto;

    const { skip, take } = getPageParams(current, pageSize);

    const where: Prisma.UserWhereInput = {};

    if (email) {
      where.email = {
        equals: email,
      };
    }

    if (nickname) {
      where.nickname = {
        contains: nickname,
      };
    }

    if (createAt) {
      const [start, end] = createAt;
      where.createAt = {
        gte: new Date(start).toISOString(),
        lte: new Date(end).toISOString(),
      };
    }

    if (updateAt) {
      const [start, end] = updateAt;
      where.updateAt = {
        gte: new Date(start).toISOString(),
        lte: new Date(end).toISOString(),
      };
    }

    const count = await this.prismaService.user.count({ where });

    if (count === 0) {
      return {
        total: 0,
        list: [],
      };
    }

    const orderBy: Prisma.UserOrderByWithRelationInput[] = [];

    if (sort) {
      Object.keys(sort).forEach((key) => {
        orderBy.push({
          [key]: sort[key],
        });
      });
    }

    const users = await this.prismaService.user.findMany({
      where,
      skip,
      take,
      orderBy,
    });
    return {
      total: count,
      list: users,
    };
  }

  /**
   * 创建用户
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashPassword = await this.hashingService.hash(password);
    const userCreateInput: Prisma.UserCreateInput = {
      ...user,
      password: hashPassword,
      createAt: new Date(),
    };
    return this.prismaService.user.create({
      data: userCreateInput,
    });
  }

  /**
   * 修改用户基本信息
   * @param userId
   * @param updateUserDto
   */
  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const { nickname, avatar } = updateUserDto;
    const userUpdateInput: Prisma.UserUpdateInput = {
      nickname,
      avatar,
    };
    return this.prismaService.user.update({
      where: { id: userId },
      data: userUpdateInput,
    });
  }

  /**
   * 修改用户密码
   * @param userId
   * @param updatePasswordDto
   */
  async updateUserPassword(
    userId: number,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new BadRequestException();
    }
    const { oldPassword, newPassword } = updatePasswordDto;
    const isEqual = await this.hashingService.compare(
      oldPassword,
      user.password,
    );
    if (!isEqual) {
      throw new BadRequestException('密码错误');
    }
    const hashPassword = await this.hashingService.hash(newPassword);
    return this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashPassword },
    });
  }

  /**
   * 根据用户 id获取用户信息
   * @param userId
   */
  async findUserById(userId: number) {
    return this.prismaService.user.findUnique({ where: { id: userId } });
  }
  async findUserByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }
}
