import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  startDate: string;
  @IsString()
  @IsNotEmpty()
  endDate: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsNumber()
  remindId: number;
  @IsNumber()
  frequencyId: number;
  @IsNumber()
  userId: number;
  @IsNumber()
  roomId: number;
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  attendUserIds: number[];
}
