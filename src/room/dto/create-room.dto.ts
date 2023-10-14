import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsPositive()
  @Min(1)
  cap: number;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
}
