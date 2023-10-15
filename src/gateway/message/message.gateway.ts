import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway({ namespace: '/sys/message', transports: 'websocket' })
export class MessageGateway {
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any): WsResponse<any> {
    return { event: 'sysMessage', data: 'Hello world!' + body };
  }
}
