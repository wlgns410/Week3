import { Module } from '@nestjs/common';
import { UserController } from '../presentation/user/controllers/user.controller';
import { UserCreateService } from '../application/user/services/user-create.service';
import { UserCreateRepositoryImpl } from '../infrastructure/user/repositories/user-create-repository.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../infrastructure/user/entities/user.entity';
import { UserBalanceLog } from '../infrastructure/user/entities/user-balance-log.entity';
import { UserBalanceRepositoryImpl } from '../infrastructure/user/repositories/user-balance-repository.impl';
import { UserBalanceService } from '../application//user/services/user-balance.service';
import { UserQueueOrderService } from '../application/user/services/user-queue.service';
import { UserQueueOrderRepositoryImpl } from '../infrastructure/user/repositories/user-queueing-token-repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserBalanceLog])],
  providers: [
    UserCreateService,
    {
      provide: 'UserCreateRepository',
      useClass: UserCreateRepositoryImpl,
    },
    UserBalanceService,
    {
      provide: 'UserBalanceRepository',
      useClass: UserBalanceRepositoryImpl,
    },
    UserQueueOrderService,
    {
      provide: 'UserQueueOrderRepository',
      useClass: UserQueueOrderRepositoryImpl,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
