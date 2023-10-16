import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PageDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  current: number;
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  pageSize: number;
}
