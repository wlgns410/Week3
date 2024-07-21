import { Module } from '@nestjs/common';
import { RedisLockService } from './redis-config';

@Module({
  providers: [RedisLockService],
  exports: [RedisLockService],
})
export class RedisModule {}
