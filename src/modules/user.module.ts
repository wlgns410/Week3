import { Module } from '@nestjs/common';
import { UserController } from '../presentation/users/controllers/user.controller';

@Module({
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
