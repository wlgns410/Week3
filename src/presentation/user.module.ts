import { Module } from '@nestjs/common';
import { UserController } from '../presentation/controllers/user.controller';

@Module({
  controllers: [UserController],
})
export class UserModule {}
