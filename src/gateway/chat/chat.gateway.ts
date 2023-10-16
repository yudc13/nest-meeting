import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { ChatToServerDto } from '../dto/chat-to-server.dto';
import { ChatService } from '../../chat/chat.service';

@WebSocketGateway({ transports: 'websocket' })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @SubscribeMessage('chatToServer')
  async handleSendMessage(
    @MessageBody() body: ChatToServerDto,
  ): Promise<WsResponse<ChatToServerDto>> {
    await this.chatService.createChat(body);
    return { event: 'chatToClient', data: body };
  }
}
