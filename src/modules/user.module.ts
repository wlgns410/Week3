import { Module } from '@nestjs/common';
import { UserController } from '../presentation/user/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../infrastructure/user/entities/user.entity';
import { UserBalanceLog } from '../infrastructure/user/entities/user-balance-log.entity';
import { Ticketing } from '../infrastructure/ticketing/entities/ticketing.entity';
import { UserService } from '../application/user/services/user.service';
import { UserUseCase } from '../application/user/use-case/user.use-case';
import { UserRepositorySymbol } from '../domain/user/interfaces/user-repository.interface';
import { UserLogRepositorySymbol } from '../domain/user/interfaces/user-log-repository.interface';
import { UserRepositoryImplementation } from '../infrastructure/user/repositories/user-repository.implementation';
import { UserLogRepositoryImplementation } from '../infrastructure/user/repositories/user-log-repository.implementation';
@Module({
  imports: [TypeOrmModule.forFeature([User, UserBalanceLog, Ticketing])],
  providers: [
    UserUseCase,
    UserService,
    {
      provide: UserRepositorySymbol,
      useClass: UserRepositoryImplementation,
    },
    {
      provide: UserLogRepositorySymbol,
      useClass: UserLogRepositoryImplementation,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
