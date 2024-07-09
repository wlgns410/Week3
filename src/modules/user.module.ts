import { Module } from '@nestjs/common';
import { UserController } from '../presentation/user/controllers/user.controller';
import { UserCreateService } from '../application/user/services/user-create.service';
import { UserCreateRepositoryImpl } from '../infrastructure/user/repositories/user-create-repository.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../infrastructure/user/entities/user.entity';
import { UserRepository } from '../domain/user/interfaces/user-create-repository.interface';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserCreateService,
    {
      provide: 'UserRepository',
      useClass: UserCreateRepositoryImpl,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
