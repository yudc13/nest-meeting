import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '../../common/dto/page.dto';
import { LOG_ACTION } from '../../common/decorator/log.decorator';
import { IsEnum, IsOptional } from 'class-validator';

export class QueryLogDto extends IntersectionType(PageDto) {
  @IsEnum(LOG_ACTION)
  @IsOptional()
  action?: LOG_ACTION;
}
