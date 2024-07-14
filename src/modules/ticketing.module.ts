import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticketing } from '../infrastructure/Ticketing/entities/ticketing.entity';
import { ConcertDetail } from '../infrastructure/concert/entities/concert-detail.entity';
import { TicketLog } from '../infrastructure/Ticketing/entities/ticket-log.entity';
import { User } from '../infrastructure/User/entities/user.entity';
import { TicketingService } from '../application/ticketing/services/ticketing.service';
import { TicketingRepositoryImpl } from '../infrastructure/ticketing/repositories/ticketing-repository.impl';
import { TicketingController } from '../presentation/ticketing/controllers/ticketing.controller';
import { ReservationTicketUseCase } from '../application/ticketing/use-case/reservation-ticket.use-case';
import { TicketingRepositorySymbol } from '../domain/ticketing/interfaces/ticketing-repository.interface';
@Module({
  imports: [
    TypeOrmModule.forFeature([Ticketing, TicketLog, User, ConcertDetail]),
  ],
  providers: [
    ReservationTicketUseCase,
    TicketingService,
    {
      provide: TicketingRepositorySymbol,
      useClass: TicketingRepositoryImpl,
    },
  ],
  exports: [
    TicketingService,
    {
      provide: TicketingRepositorySymbol,
      useClass: TicketingRepositoryImpl,
    },
  ],
  controllers: [TicketingController],
})
export class TicketingModule {}
