import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const valueString = JSON.stringify(value);
    if (ttl) {
      await this.redisClient.set(key, valueString, 'EX', ttl);
    } else {
      await this.redisClient.set(key, valueString);
    }
  }

  async get(key: string): Promise<any> {
    const valueString = await this.redisClient.get(key);
    if (valueString) {
      return JSON.parse(valueString);
    }
    return null;
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
