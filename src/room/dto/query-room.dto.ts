import { IntersectionType } from '@nestjs/mapped-types';
import { PageDto } from '../../common/dto/page.dto';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryRoomDto extends IntersectionType(PageDto) {
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @Type(() => Number)
  cap: number[];
  @IsString()
  @IsOptional()
  startDate: string;
  @IsString()
  @IsOptional()
  endDate: string;
  @IsBoolean()
  @IsOptional()
  isIdle: boolean;
}
