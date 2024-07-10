import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserBalanceLog } from '../entities/user-balance-log.entity';
import { UserBalanceRepository } from '../../../domain/user/interfaces/user-charge-repository.interface';
import { UserBalanceChargeDto } from '../../../domain/user/entites/user-charge-balance.entity';

@Injectable()
export class UserBalanceRepositoryImpl implements UserBalanceRepository {
  constructor(
    @InjectRepository(UserBalanceLog)
    private readonly userBalanceRepository: Repository<UserBalanceLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async chargeBalance(userBalanceDto: UserBalanceChargeDto): Promise<void> {
    return await this.userBalanceRepository.manager.transaction(
      async (transactionManager) => {
        const user = await this.userRepository.findOne({
          where: { id: userBalanceDto.userId },
        });
        if (!user) {
          throw new Error('User not found');
        }

        user.balance += userBalanceDto.balance;
        await transactionManager.save(user);

        const newUserLog = new UserBalanceLog();
        newUserLog.user_id = userBalanceDto.userId;
        newUserLog.amount = userBalanceDto.balance;
        newUserLog.transactionType = 'CHARGE';
        await transactionManager.save(newUserLog);
      },
    );
  }
}
