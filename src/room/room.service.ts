import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

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
