import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

// @Injectable()
// export class RedisLockService {
//   private readonly redisPublisher: Redis;
//   private readonly redisSubscriber: Redis;
//   private readonly LOCK_TIMEOUT = 3000; // 3 seconds

//   constructor() {
//     this.redisPublisher = new Redis({
//       host: 'localhost',
//       port: 6379,
//     });
//     this.redisSubscriber = new Redis({
//       host: 'localhost',
//       port: 6379,
//     });

//     this.redisSubscriber.on('message', (channel, message) => {
//       if (channel === 'lock_channel') {
//         this.handleLockMessage(message);
//       }
//     });
//     this.redisSubscriber.subscribe('lock_channel');
//   }

//   async acquireLock(key: string): Promise<boolean> {
//     const lockKey = `lock:${key}`;
//     const result = await this.redisPublisher.set(
//       lockKey,
//       'locked',
//       'PX',
//       this.LOCK_TIMEOUT, // ttl로 데드락 방지
//       'NX',
//     );
//     return result === 'OK';
//   }

//   async releaseLock(key: string): Promise<void> {
//     const lockKey = `lock:${key}`;
//     await this.redisPublisher.del(lockKey);
//     await this.redisPublisher.publish('lock_channel', lockKey);
//   }

//   // 해당 코드가 채널 락을 한번 더 검증해서 락을 빠르게 풀어줌
//   // 코드상으로 왜 그런지는 모르겠는데 락을 한 번 더 풀어주는것이 성공하는 횟수가 더 많았음
//   private handleLockMessage(message: string) {
//     const key = message.replace('unlock:', '');
//     this.redisPublisher.del(`lock:${key}`);
//     console.log(`Lock handle message processed for key: ${key}`);
//   }

//   async onModuleDestroy() {
//     await this.redisPublisher.quit();
//     await this.redisSubscriber.quit();
//   }
// }

@Injectable()
export class RedisLockService {
  private readonly LOCK_TIMEOUT = 3000; // 3 seconds

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async acquireLock(key: string): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const result = await this.redisClient.set(
      lockKey,
      'locked',
      'PX',
      this.LOCK_TIMEOUT, // ttl로 데드락 방지
      'NX',
    );
    console.log(
      `Lock ${result === 'OK' ? 'acquired' : 'not acquired'} for key: ${lockKey}`,
    );
    return result === 'OK';
  }

  async releaseLock(key: string): Promise<void> {
    const lockKey = `lock:${key}`;
    await this.redisClient.del(lockKey);
    console.log(`Lock released for key: ${lockKey}`);
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
