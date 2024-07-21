import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserUseCase } from '../../../application/user/use-case/user.use-case';

@Injectable()
export class UserScheduler {
  constructor(private readonly userUseCase: UserUseCase) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    await this.userUseCase.executeCheckUser(now);
  }
}
