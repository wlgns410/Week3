import { Module } from '@nestjs/common';
import { TicketingController } from '../presentation/ticketing/controller/ticketing.controller';

@Module({
  controllers: [TicketingController],
  providers: [],
})
export class TicketingModule {}
