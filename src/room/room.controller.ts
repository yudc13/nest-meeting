import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomDto } from './dto/query-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async getRoomList(@Body() queryRoomDto: QueryRoomDto) {
    return this.roomService.getRoomList(queryRoomDto);
  }

  @Put()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }

  @Put(':roomId')
  async update(
    @Param('roomId') roomId: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.updateRoom(roomId, updateRoomDto);
  }
}
