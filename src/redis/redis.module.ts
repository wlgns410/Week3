import { Module } from '@nestjs/common';
import { RedisLockService } from './redis-lock.service';
import { RedisCacheService } from './redis-cache.service';
import { RedisProvider } from './redis.config';
import { RedisQueueService } from './redis-queue.service';

@Module({
  providers: [
    RedisProvider,
    RedisLockService,
    RedisCacheService,
    RedisQueueService,
  ],
  exports: [RedisLockService, RedisCacheService, RedisQueueService],
})
export class RedisModule {}
