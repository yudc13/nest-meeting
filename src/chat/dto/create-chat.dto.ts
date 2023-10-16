import { IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  meetingId: number;
  @IsNumber()
  senderId: number;
  @IsString()
  content: string;
}
