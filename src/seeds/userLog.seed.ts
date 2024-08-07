import { UserBalanceLog } from '../infrastructure/user/entities/user-balance-log.entity';
import { DataSource } from 'typeorm';

export class UserBalanceLogSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const userBalanceLogRepository = dataSource.getRepository(UserBalanceLog);

    const userId = 21;
    const amount = 1000;
    const transactionType = 'CHARGE';

    const logs = [];

    for (let i = 0; i < 1000000; i++) {
      const log = userBalanceLogRepository.create({
        userId,
        amount,
        transactionType,
        createdAt: new Date(),
      });
      logs.push(log);

      if (logs.length === 10000) {
        await userBalanceLogRepository.save(logs);
        logs.length = 0;
      }
    }

    // 나머지 데이터 저장
    if (logs.length > 0) {
      await userBalanceLogRepository.save(logs);
    }
  }
}
