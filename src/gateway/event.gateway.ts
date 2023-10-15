import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ transports: 'websocket' })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger(EventGateway.name);

  afterInit(server: any) {
    this.logger.log('Socket Init');
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Socket Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Socket DisConnected: ${client.id}`);
  }

  @SubscribeMessage('msg')
  handleMessage(@MessageBody() body: any): WsResponse<any> {
    this.logger.log('--> ', body);
    return { event: 'msgToClient', data: 'ok' };
  }
}
