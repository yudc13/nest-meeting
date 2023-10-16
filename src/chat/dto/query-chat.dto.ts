import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '../../common/dto/page.dto';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryChatDto extends IntersectionType(PageDto) {
  @IsNumber()
  @Type(() => Number)
  meetingId: number;
}
