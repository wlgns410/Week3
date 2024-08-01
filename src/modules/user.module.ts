import { Module } from '@nestjs/common';
import { UserController } from '../presentation/user/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../infrastructure/user/entities/user.entity';
import { UserBalanceLog } from '../infrastructure/user/entities/user-balance-log.entity';
import { Ticketing } from '../infrastructure/ticketing/entities/ticketing.entity';
import { UserService } from '../application/user/services/user.service';
import { UserUseCase } from '../application/user/use-case/user.use-case';
import { QueueUseCase } from '../application/user/use-case/queue.use-case';
import { QueueService } from '../application/user/services/queue.service';
import { UserRepositorySymbol } from '../domain/user/interfaces/user-repository.interface';
import { UserLogRepositorySymbol } from '../domain/user/interfaces/user-log-repository.interface';
import { UserRepositoryImplementation } from '../infrastructure/user/repositories/user-repository.implementation';
import { UserLogRepositoryImplementation } from '../infrastructure/user/repositories/user-log-repository.implementation';
import { TicketingRepositorySymbol } from '../domain/ticketing/interfaces/ticketing-repository.interface';
import { TicketingRepositoryImplementation } from '../infrastructure/ticketing/repositories/ticketing-repository.implementation';
import { RedisModule } from '../redis/redis.module';
import { QueueController } from '../presentation/user/controllers/queue.controller';
import { QueueScheduler } from '../presentation/user/schedulers/queue.scheduler';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserBalanceLog, Ticketing]),
    RedisModule,
    JwtModule,
  ],
  providers: [
    UserUseCase,
    UserService,
    QueueUseCase,
    QueueService,
    QueueScheduler,
    {
      provide: UserRepositorySymbol,
      useClass: UserRepositoryImplementation,
    },
    {
      provide: UserLogRepositorySymbol,
      useClass: UserLogRepositoryImplementation,
    },
    {
      provide: TicketingRepositorySymbol,
      useClass: TicketingRepositoryImplementation,
    },
  ],
  exports: [
    UserService,
    UserUseCase,
    QueueUseCase,
    QueueService,
    {
      provide: UserRepositorySymbol,
      useClass: UserRepositoryImplementation,
    },
    {
      provide: UserLogRepositorySymbol,
      useClass: UserLogRepositoryImplementation,
    },
    {
      provide: TicketingRepositorySymbol,
      useClass: TicketingRepositoryImplementation,
    },
  ],
  controllers: [UserController, QueueController],
})
export class UserModule {}
