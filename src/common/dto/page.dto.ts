import { IsNumber, IsPositive } from 'class-validator';

export class PageDto {
  @IsNumber()
  @IsPositive()
  current: number;
  @IsNumber()
  @IsPositive()
  pageSize: number;
}
