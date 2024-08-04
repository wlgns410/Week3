import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepositorySymbol,
  UserRepository,
} from '../../../domain/user/interfaces/user-repository.interface';
import { QueueStatus } from '../../../presentation/user/dtos/user-queue-status-dto';
import {
  UserQueueDto,
  UserQueueStatusDto,
} from '../../../presentation/user/dtos/user-queue-status-dto';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RedisQueueService } from '../../../redis/redis-queue.service';

@Injectable()
export class QueueService {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisQueueService,
  ) {}

  async createQueue(
    manager: EntityManager,
    userQueueDto: UserQueueDto,
  ): Promise<string> {
    const user = await this.userRepository.findUserByIdWithLock(
      manager,
      userQueueDto.userId,
    );

    const now = Date.now() + 5 * 60 * 1000;
    const payload = {
      userId: user.id,
    };
    const token = this.jwtService.sign(payload);

    await this.redisService.addWaitingToken(token, now);
    return token;
  }

  async getWatingQueuePosition(token: string): Promise<number | null> {
    return await this.redisService.getWatingQueuePosition(token);
  }

  // 좌석 예매나 결제 시 active 상태인지 확인 - 티케팅시 사용
  async validateToken(token: string): Promise<boolean> {
    return await this.redisService.validateActiveToken(token);
  }

  // 스케쥴러
  async activateTokens(): Promise<void> {
    await this.redisService.promoteTokensToActive();
  }

  // 스케쥴러
  async clearExpiredTokens(): Promise<void> {
    await this.redisService.removeExpiredTokens();
  }
}
