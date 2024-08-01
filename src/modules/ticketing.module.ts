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
import { ConcertDetailRepositoryImplementation } from '../infrastructure/concert/repositories/concert-repostiory.implementation';
import { TicketingLogRepositorySymbol } from '../domain/ticketing/interfaces/ticketing-log-repository.interface';
import { TicketingLogRepositoryImplementation } from '../infrastructure/ticketing/repositories/ticketing-log-repository.implementation';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../modules/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticketing, TicketLog, User, ConcertDetail]),
    RedisModule,
    UserModule,
    JwtModule,
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
      useClass: ConcertDetailRepositoryImplementation,
    },
    {
      provide: TicketingLogRepositorySymbol,
      useClass: TicketingLogRepositoryImplementation,
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
      useClass: ConcertDetailRepositoryImplementation,
    },
    {
      provide: TicketingLogRepositorySymbol,
      useClass: TicketingLogRepositoryImplementation,
    },
  ],
  controllers: [TicketingController],
})
export class TicketingModule {}
