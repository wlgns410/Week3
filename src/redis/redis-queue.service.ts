import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisQueueService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // waiting status token 추가
  async addWaitingToken(token: string, now: number): Promise<void> {
    await this.redisClient.zadd(
      'waiting_tokens',
      now,
      JSON.stringify({ token }),
    );
  }

  // waiting status token 순번 조회
  async getWatingQueuePosition(token: string): Promise<number | null> {
    const tokenData = await this.redisClient.zrange('waiting_tokens', 0, -1);
    for (let i = 0; i < tokenData.length; i++) {
      const { token: storedToken } = JSON.parse(tokenData[i]);
      if (storedToken === token) {
        const rank = await this.redisClient.zrank(
          'waiting_tokens',
          tokenData[i],
        );
        return rank;
      }
    }
    return null;
  }

  // waiting status token 을 active status로 변경
  async promoteTokensToActive(): Promise<string[]> {
    const now = Date.now();
    const tokensToPromote = await this.redisClient.zrangebyscore(
      'waiting_tokens',
      0,
      now,
      'LIMIT',
      0,
      10,
    );
    for (const tokenData of tokensToPromote) {
      const { token, user } = JSON.parse(tokenData);
      await this.redisClient.sadd(
        'active_tokens',
        JSON.stringify({ token, user, expiresAt: now + 300000 }),
      );
      await this.redisClient.zrem('waiting_tokens', tokenData);
    }
    return tokensToPromote;
  }

  // active status token 검증
  async validateActiveToken(token: string): Promise<boolean> {
    const activeTokens = await this.redisClient.smembers('active_tokens');
    for (const tokenData of activeTokens) {
      const { token: storedToken, expiresAt } = JSON.parse(tokenData);
      if (storedToken === token) {
        if (Date.now() <= expiresAt) {
          return true;
        } else {
          await this.redisClient.srem('active_tokens', tokenData);
          return false;
        }
      }
    }
    return false;
  }

  // active status token 시간 내에 미결제시 만료처리
  async removeExpiredTokens(): Promise<void> {
    const activeTokens = await this.redisClient.smembers('active_tokens');
    const now = Date.now();
    for (const tokenData of activeTokens) {
      const { expiresAt } = JSON.parse(tokenData);
      if (now > expiresAt) {
        await this.redisClient.srem('active_tokens', tokenData);
      }
    }
  }

  // waiting status token 계속 접속했는 지 확인하고 expired 처리
}
