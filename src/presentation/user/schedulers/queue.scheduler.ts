import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueUseCase } from '../../../application/user/use-case/queue.use-case';

@Injectable()
export class QueueScheduler {
  constructor(private readonly queueUseCase: QueueUseCase) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async executeActivateTokens() {
    await this.queueUseCase.executeActivateTokens();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async executeClearExpiredTokens() {
    await this.queueUseCase.executeClearExpiredTokens();
  }
}
