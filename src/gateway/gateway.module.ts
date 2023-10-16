import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { MessageGateway } from './message/message.gateway';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  providers: [EventGateway, MessageGateway, ChatGateway],
})
export class GatewayModule {}
