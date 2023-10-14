import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';

@Module({
  imports: [UserModule],
  providers: [MeetingService],
  controllers: [MeetingController],
})
export class MeetingModule {}
