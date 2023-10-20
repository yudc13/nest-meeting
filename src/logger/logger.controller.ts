import { Controller, Get, Query } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { QueryLogDto } from './dto/query-log.dto';

@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get()
  async getLoggerList(@Query() queryLogDto: QueryLogDto) {
    return this.loggerService.getLoggerList(queryLogDto);
  }
}
