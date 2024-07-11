import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { QueueStatus, User } from '../entities/user.entity';
import { UserQueueOrderRepository } from '../../../domain/user/interfaces/user-queue-repository.interface';
import { UserQueueDto } from '../../../domain/user/entites/user-queue.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserQueueStatusDto } from '../../../domain/user/entites/user-queue.entity';

@Injectable()
export class UserQueueOrderRepositoryImpl implements UserQueueOrderRepository {
  constructor(
    @InjectRepository(User)
    private readonly userQueueRepository: Repository<User>,
  ) {}

  async createQueue(userQueueDto: UserQueueDto): Promise<void> {
    return await this.userQueueRepository.manager.transaction(
      async (manager) => {
        const user = await this.userQueueRepository.findOne({
          where: { id: userQueueDto.userId },
        });
        if (!user) {
          throw new Error('User not found');
        }

        const currentOrder = await this.getNextOrder();
        const estimatedWaitTime = currentOrder * 10; // 1명당 대기시간 10초씩 기다린다고 가정
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 만료시간은 현재 시간으로부터 5분 후

        user.queue_status = QueueStatus.ACTIVE;
        user.currentOrder = currentOrder;
        user.estimated_wait_time = estimatedWaitTime;
        user.expires_at = expiresAt;

        await manager.save(user);
      },
    );
  }

  // 대기열 순서
  private async getNextOrder(): Promise<number> {
    const activeUsersCount = await this.userQueueRepository.count({
      where: { queue_status: QueueStatus.ACTIVE },
    });

    return activeUsersCount + 1;
  }

  // 대기열 토큰 관리 스케쥴러
  @Cron(CronExpression.EVERY_MINUTE) // 대기열 만료 확인 스케쥴러 1분마다 동작
  async handleCron() {
    await this.userQueueRepository.manager.transaction(async (manager) => {
      const now = new Date();
      const expiredUsers = await this.userQueueRepository.find({
        where: { queue_status: QueueStatus.ACTIVE, expires_at: LessThan(now) },
      });

      await Promise.all(
        expiredUsers.map(async (user) => {
          user.queue_status = QueueStatus.EXPIRED;
          user.estimated_wait_time = null;
          user.expires_at = null;
          await manager.save(user);
        }),
      );
    });
  }

  async getQueueStatus(
    userQueueDto: UserQueueDto,
  ): Promise<UserQueueStatusDto | undefined> {
    return this.userQueueRepository.findOne({
      where: { id: userQueueDto.userId },
      select: [
        'queue_status',
        'currentOrder',
        'estimated_wait_time',
        'expires_at',
      ],
    });
  }
}
