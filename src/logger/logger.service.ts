import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoggerService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLogger(payload: Prisma.LoggerCreateInput) {
    return this.prismaService.logger.create({ data: payload });
  }
}
