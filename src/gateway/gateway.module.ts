import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { MessageGateway } from './message/message.gateway';

@Module({
  providers: [EventGateway, MessageGateway],
})
export class GatewayModule {}
