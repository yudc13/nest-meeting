import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { getPageParams } from '../utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 查询会议室列表
   * @param queryRoomDto
   */
  async getRoomList(queryRoomDto: QueryRoomDto) {
    const { current, pageSize, cap, isIdle, startDate, endDate } = queryRoomDto;
    const { skip, take } = getPageParams(current, pageSize);
    const where: Prisma.RoomWhereInput = {};

    if (cap && cap.length > 0) {
      const [min, max] = cap;
      const and: Prisma.RoomWhereInput[] = [{ cap: { gte: min } }];
      // -1 无穷大
      if (max !== -1) {
        and.push({
          cap: { lte: max },
        });
      }
      where.AND = and;
    }

    // 需要查询空闲的会议室
    if (isIdle !== undefined && startDate && endDate) {
      const meetingWhere: Prisma.MeetingWhereInput = {};
      meetingWhere.OR = [
        {
          startDate: {
            gte: startDate,
            lt: endDate,
          },
        },
        {
          endDate: {
            gt: startDate,
            lte: endDate,
          },
        },
      ];
      const meetings = await this.prismaService.meeting.findMany({
        select: { roomId: true },
        where: meetingWhere,
      });
      const roomIds = meetings.map((m) => m.roomId);
      where.id = {
        [isIdle ? 'notIn' : 'in']: roomIds,
      };
    }

    const count = await this.prismaService.room.count({ where });
    if (count === 0) {
      return {
        total: count,
        list: [],
      };
    }
    const list = await this.prismaService.room.findMany({
      where,
      skip,
      take,
      orderBy: [{ id: 'asc' }],
    });
    return {
      total: count,
      list,
    };
  }

  /**
   * 创建会议室
   * @param createRoomDto
   */
  async createRoom(createRoomDto: CreateRoomDto) {
    const { disabled, ...room } = createRoomDto;
    const isExist = await this.findRoomByTitle(room.title);
    if (isExist) {
      throw new ConflictException('会议室已存在');
    }
    return this.prismaService.room.create({
      data: { ...room, disabled: disabled ?? false },
    });
  }

  /**
   * 更新会议室信息
   * @param roomId
   * @param updateRoomDto
   */
  async updateRoom(roomId: number, updateRoomDto: UpdateRoomDto) {
    const isExist = await this.findRoomById(roomId);
    if (!isExist) {
      throw new BadRequestException('会议室不存在');
    }
    const isRepeat = await this.prismaService.room.findFirst({
      where: {
        id: {
          not: roomId,
        },
        title: updateRoomDto.title,
      },
    });
    if (isRepeat) {
      throw new ConflictException('会议室名称重复');
    }
    return this.prismaService.room.update({
      where: { id: roomId },
      data: updateRoomDto,
    });
  }

  /**
   * 删除会议室
   * @param roomId
   */
  async deleteRoomById(roomId: number) {
    return this.prismaService.room.delete({ where: { id: roomId } });
  }

  /**
   * 根据会议室名称查询会议室信息
   * @param title
   */
  async findRoomByTitle(title: string) {
    return this.prismaService.room.findUnique({ where: { title } });
  }

  /**
   * 根据会议室id查询会议室信息
   * @param id
   */
  async findRoomById(id: number) {
    return this.prismaService.room.findUnique({ where: { id } });
  }
}
