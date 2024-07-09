import { Module } from '@nestjs/common';
import { TicketingController } from '../presentation/ticketing/controllers/ticketing.controller';

@Module({
  controllers: [TicketingController],
  providers: [],
})
export class TicketingModule {}
