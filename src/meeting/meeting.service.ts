import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { getPageParams } from '../utils';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { QueryMeetingDto } from './dto/query-meeting.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class MeetingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  /**
   * 查询会议列表
   * @param currentUserId 当前登录用户id
   * @param queryMeetingDto
   */
  async findMeetings(currentUserId: number, queryMeetingDto: QueryMeetingDto) {
    const { current, pageSize, roomId } = queryMeetingDto;
    let userId = queryMeetingDto.userId;
    const where: Prisma.MeetingWhereInput = { OR: [] };
    const userInfo = await this.userService.findUserById(currentUserId);
    // 不是管理员 只能查看自己创建/参与的会议
    const isAdmin = userInfo.role === UserRole.ADMIN;
    if (!isAdmin) {
      userId = currentUserId;
      where.OR.push({ meetingUsers: { some: { userId } } });
    }
    if (userId) {
      where.OR.push({ userId });
    }
    if (roomId) {
      where.roomId = roomId;
    }
    const count = await this.prismaService.meeting.count({ where });
    if (count === 0) {
      return { total: 0, list: [] };
    }
    const { skip, take } = getPageParams(current, pageSize);
    const list = await this.prismaService.meeting.findMany({
      where,
      include: {
        room: {
          select: { id: true, title: true, address: true, cap: true },
        },
        user: {
          select: { id: true, email: true, avatar: true, nickname: true },
        },
        meetingUsers: {
          select: {
            signin: true,
            user: {
              select: { id: true, email: true, avatar: true, nickname: true },
            },
          },
        },
      },
      skip,
      take,
      orderBy: [{ startDate: 'asc' }, { createAt: 'desc' }],
    });
    return {
      total: count,
      list,
    };
  }

  /**
   * 创建会议
   * @param createMeetingDto
   */
  async createMeeting(createMeetingDto: CreateMeetingDto) {
    const { attendUserIds, ...meeting } = createMeetingDto;
    const { userId, roomId, ...meetingData } = meeting;
    return this.prismaService.meeting.create({
      data: {
        ...meetingData,
        // startDate: dayjs(startDate).format('YYYY-MM-DD HH:mm'),
        // endDate: dayjs(endDate).format('YYYY-MM-DD HH:mm'),
        createAt: new Date(),
        user: {
          connect: { id: userId },
        },
        room: {
          connect: { id: roomId },
        },
        meetingUsers: {
          createMany: { data: attendUserIds.map((id) => ({ userId: id })) },
        },
      },
    });
  }

  /**
   * 查询会议详情
   * @param meetingId
   */
  async findMeetingById(meetingId: number) {
    return this.prismaService.meeting.findUnique({ where: { id: meetingId } });
  }

  /**
   * 验证用户是否是空闲的
   * @param userId
   * @param meetingId
   */
  async validateUserIsFree(userId: number, meetingId: number) {
    const select: Prisma.MeetingSelect = {
      id: true,
      startDate: true,
      endDate: true,
    };
    // 查询和改用户相关的会议
    const userRelMeetings = await this.prismaService.meeting.findMany({
      select,
      where: { meetingUsers: { some: { userId } } },
    });
    if (userRelMeetings.length === 0) {
      return true;
    }
    const meeting = await this.prismaService.meeting.findUnique({
      select,
      where: { id: meetingId },
    });
    // 判断时间是否有冲突
    const isConflict = userRelMeetings.some((um) => {
      const meetingFullStartDate = meeting.startDate;
      return (
        dayjs(meetingFullStartDate).isAfter(um.startDate) &&
        dayjs(meetingFullStartDate).isBefore(um.endDate)
      );
    });
    return !isConflict;
  }

  /**
   * 邀请加入会议
   * @param currentUserId
   * @param meetingId
   */
  async invite(currentUserId: number, meetingId: number) {
    const meeting = await this.findMeetingById(meetingId);
    if (!meeting) {
      throw new NotFoundException('会议不存在');
    }
    const isExist = await this.prismaService.meetingUsers.findFirst({
      where: { userId: currentUserId, meetingId },
    });
    if (isExist) {
      throw new ConflictException('您已经在此会议中');
    }
    const result = await this.prismaService.meetingUsers.create({
      data: { userId: currentUserId, meetingId, signin: false },
    });
    return result.id;
  }
}
