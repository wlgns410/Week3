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
import { TicketingScheduler } from '../presentation/ticketing/schedulers/ticketing.scheduler';
import { UserRepositorySymbol } from '../domain/user/interfaces/user-repository.interface';
import { UserRepositoryImplementation } from '../infrastructure/user/repositories/user-repository.implementation';
import { ConcertDetailRepositorySymbol } from '../domain/concert/interfaces/concert-detail-repository.interface';
import { ConcertDetailRepositoryImpl } from '../infrastructure/concert/repositories/concert-repostiory.impl';
import { TicketingLogRepositorySymbol } from '../domain/ticketing/interfaces/ticketing-log-repository.interface';
import { TicketingLogRepositoryImpl } from '../infrastructure/ticketing/repositories/ticketing-log-repository.implementation';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticketing, TicketLog, User, ConcertDetail]),
  ],
  providers: [
    ReservationTicketUseCase,
    TicketingService,
    TicketingScheduler,
    {
      provide: TicketingRepositorySymbol,
      useClass: TicketingRepositoryImplementation,
    },
    {
      provide: UserRepositorySymbol,
      useClass: UserRepositoryImplementation,
    },
    {
      provide: ConcertDetailRepositorySymbol,
      useClass: ConcertDetailRepositoryImpl,
    },
    {
      provide: TicketingLogRepositorySymbol,
      useClass: TicketingLogRepositoryImpl,
    },
  ],
  exports: [
    TicketingService,
    {
      provide: TicketingRepositorySymbol,
      useClass: TicketingRepositoryImplementation,
    },
    {
      provide: UserRepositorySymbol,
      useClass: UserRepositoryImplementation,
    },
    {
      provide: ConcertDetailRepositorySymbol,
      useClass: ConcertDetailRepositoryImpl,
    },
    {
      provide: TicketingLogRepositorySymbol,
      useClass: TicketingLogRepositoryImpl,
    },
  ],
  controllers: [TicketingController],
})
export class TicketingModule {}
