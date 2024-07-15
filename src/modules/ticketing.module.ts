import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticketing } from '../infrastructure/Ticketing/entities/ticketing.entity';
import { ConcertDetail } from '../infrastructure/concert/entities/concert-detail.entity';
import { TicketLog } from '../infrastructure/Ticketing/entities/ticket-log.entity';
import { User } from '../infrastructure/User/entities/user.entity';
import { TicketingService } from '../application/ticketing/services/ticketing.service';
import { TicketingController } from '../presentation/ticketing/controllers/ticketing.controller';
import { ReservationTicketUseCase } from '../application/ticketing/use-case/reservation-ticket.use-case';
import { TicketingRepositorySymbol } from '../domain/ticketing/interfaces/ticketing-repository.interface';
import { TicketingRepositoryImplementation } from '../infrastructure/ticketing/repositories/ticketing-repository.implementation';
@Module({
  imports: [
    TypeOrmModule.forFeature([Ticketing, TicketLog, User, ConcertDetail]),
  ],
  providers: [
    ReservationTicketUseCase,
    TicketingService,
    {
      provide: TicketingRepositorySymbol,
      useClass: TicketingRepositoryImplementation,
    },
  ],
  exports: [
    TicketingService,
    {
      provide: TicketingRepositorySymbol,
      useClass: TicketingRepositoryImplementation,
    },
  ],
  controllers: [TicketingController],
})
export class TicketingModule {}
