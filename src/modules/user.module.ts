import { Module } from '@nestjs/common';
import { UserController } from '../presentation/user/controller/user.controller';

@Module({
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
