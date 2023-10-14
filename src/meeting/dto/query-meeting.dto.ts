import { IntersectionType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { PageDto } from '../../common/dto/page.dto';

export class QueryMeetingDto extends IntersectionType(PageDto) {
  @IsNumber()
  @IsOptional()
  userId: number;
  @IsNumber()
  @IsOptional()
  roomId: number;
}
