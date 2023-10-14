import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '../common/decorator/user.decorator';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { QueryMeetingDto } from './dto/query-meeting.dto';
import { MeetingService } from './meeting.service';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  async getMeetings(
    @User('userId') userId: number,
    @Body() queryMeetingDto: QueryMeetingDto,
  ) {
    return this.meetingService.findMeetings(userId, queryMeetingDto);
  }
  @HttpCode(HttpStatus.OK)
  @Put()
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingService.createMeeting(createMeetingDto);
  }
}
