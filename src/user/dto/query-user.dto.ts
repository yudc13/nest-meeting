import { IntersectionType } from '@nestjs/mapped-types';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';

import { PageDto } from '../../common/dto/page.dto';
import { SortOder } from '../../common/constant/constants';

export class UserOrder {
  @IsEnum(SortOder, { message: '参数不合法' })
  @IsOptional()
  createAt?: Prisma.SortOrder;
  @IsEnum(SortOder, { message: '参数不合法' })
  @IsOptional()
  updateAt?: Prisma.SortOrder;
}

export class QueryUserDto extends IntersectionType(PageDto) {
  @IsOptional()
  email?: string;
  @IsOptional()
  nickname?: string;
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty({ message: '创建时间不能为空' })
  @ArrayMinSize(2, { message: '创建时间参数不合法' })
  @Type(() => String)
  @ValidateNested({ each: true, message: '创建时间参数不合法' })
  createAt?: [string, string];
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty({ message: '修改时间不能为空' })
  @ArrayMinSize(2, { message: '修改时间参数不合法' })
  @Type(() => String)
  @ValidateNested({ each: true, message: '修改时间参数不合法' })
  updateAt?: [string, string];
  @IsObject({ message: '排序参数不合法' })
  @IsOptional()
  @Type(() => UserOrder)
  @ValidateNested({ each: true, message: '排序字段不存在' })
  sort?: UserOrder[];
}
