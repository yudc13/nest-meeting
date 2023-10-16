import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { QueryChatDto } from './dto/query-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get()
  async getChatList(@Query() query: QueryChatDto) {
    return this.chatService.findChatListByMeetingId(query);
  }
}
