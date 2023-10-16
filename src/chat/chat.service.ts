import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { QueryChatDto } from './dto/query-chat.dto';
import { getPageParams } from '../utils';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 创建会议室聊天信息
   * @param createChatDto
   */
  async createChat(createChatDto: CreateChatDto) {
    const { meetingId, senderId, content } = createChatDto;
    const result = await this.prismaService.meetingChats.create({
      data: {
        meetingId,
        senderId,
        content,
        createAt: new Date().toISOString(),
      },
    });
    return this.prismaService.meetingChats.findUnique({
      select: {
        id: true,
        meetingId: true,
        senderId: true,
      },
      where: { id: result.id },
    });
  }

  /**
   * 查询会议室聊天记录
   * @param queryChatDto
   */
  async findChatListByMeetingId(queryChatDto: QueryChatDto) {
    const { current, pageSize, meetingId } = queryChatDto;
    const { skip, take } = getPageParams(current, pageSize);
    return this.prismaService.meetingChats.findMany({
      select: {
        id: true,
        meetingId: true,
        content: true,
        createAt: true,
        senderId: true,
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
      where: { meetingId },
      skip,
      take,
    });
  }
}
