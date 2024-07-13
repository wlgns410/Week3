import { Module } from '@nestjs/common';
import { TicketingController } from '../presentation/ticketing/controllers/ticketing.controller';
import { TicketingRepositoryImpl } from '../infrastructure/ticketing/repositories/ticketing-repository.impl';
import { TicketingService } from '../application/ticketing/services/ticketing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertDetail } from '../infrastructure/concert/entities/concert-detail.entity';
import { TicketLog } from '../infrastructure/Ticketing/entities/ticket-log.entity';
import { User } from '../infrastructure/User/entities/user.entity';
import { Ticketing } from '../infrastructure/Ticketing/entities/ticketing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConcertDetail, Ticketing, TicketLog, User]),
  ],
  controllers: [TicketingController],
  providers: [
    TicketingService,
    {
      provide: 'TicketingRepository',
      useClass: TicketingRepositoryImpl,
    },
  ],
})
export class TicketingModule {}
