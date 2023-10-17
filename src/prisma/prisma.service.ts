import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger: Logger = new Logger(PrismaService.name);
  constructor() {
    super({
      log: [{ level: 'query', emit: 'event' }],
    });
    this.$on('query', (e) => {
      this.logger.log('Query: ' + e.query);
      this.logger.log('Params: ' + e.params);
      this.logger.log('Duration: ' + e.duration + 'ms');
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
