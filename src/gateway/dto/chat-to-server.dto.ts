import { IsNumber, IsString } from 'class-validator';

export class ChatToServerDto {
  @IsNumber()
  meetingId: number;
  @IsNumber()
  senderId: number;
  @IsString()
  content: string;
}
