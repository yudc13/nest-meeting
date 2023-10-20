import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QueryLogDto } from './dto/query-log.dto';
import { getPageParams } from '../utils';

@Injectable()
export class LoggerService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 查询日志列表
   * @param queryLogDto
   */
  async getLoggerList(queryLogDto: QueryLogDto) {
    const { current, pageSize, action } = queryLogDto;
    const { skip, take } = getPageParams(current, pageSize);
    const where: Prisma.LoggerWhereInput = {};
    if (action) {
      where.action = action;
    }
    const count = await this.prismaService.logger.count({ where });
    if (count === 0) {
      return {
        total: 0,
        list: [],
      };
    }
    const list = await this.prismaService.logger.findMany({
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            email: true,
            avatar: true,
          },
        },
      },
      where,
      skip,
      take,
      orderBy: [{ createAt: 'desc' }, { id: 'asc' }],
    });
    return {
      total: count,
      list,
    };
  }

  /**
   * 创建日志
   * @param payload
   */
  async createLogger(payload: Prisma.LoggerCreateInput) {
    return this.prismaService.logger.create({ data: payload });
  }
}
