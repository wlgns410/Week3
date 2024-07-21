import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserBalanceChargeDto } from '../../../presentation/user/dtos/user-balance-dto';
import {
  UserQueueDto,
  UserQueueStatusDto,
} from '../../../presentation/user/dtos/user-queue-status-dto';
import {
  UserPaymentDto,
  UserPaymentResponseDto,
} from '../../../presentation/user/dtos/user-payment-dto';
import { Transactional } from 'typeorm-transactional';
import { AppDataSource } from '../../../config/typeorm-config';
import { RedisLockService } from '../../../redis/redis-config';

@Injectable()
export class UserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisLockService,
  ) {}

  async executeCreateUser(name: string): Promise<void> {
    await this.userService.createUser(name);
  }

  async executeGetUserBalance(userId: number): Promise<number> {
    return await this.userService.getUserBalance(userId);
  }

  async executeCheckUser(now: Date): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.userService.checkUser(now);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to check users');
    } finally {
      await queryRunner.release();
    }
  }

  async executeGetQueueStatus(
    userId: number,
  ): Promise<UserQueueStatusDto | undefined> {
    return await this.userService.getQueueStatus(userId);
  }

  async executeChargeBalance(
    userBalanceDto: UserBalanceChargeDto,
  ): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Redis 락 획득
    const lockKey = `charge_balance_${userBalanceDto.userId}`;
    const acquired = await this.redisService.acquireLock(lockKey);
    if (!acquired) {
      throw new InternalServerErrorException('Failed to acquire lock');
    }

    await queryRunner.startTransaction();

    try {
      await this.userService.chargeBalance(userBalanceDto, queryRunner.manager);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to charge balance');
    } finally {
      // Redis 락 해제
      await queryRunner.release();
      await this.redisService.releaseLock(lockKey);
    }
  }

  async executeCreateQueue(userQueueDto: UserQueueDto): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.userService.createQueue(userQueueDto);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create queue');
    } finally {
      await queryRunner.release();
    }
  }

  async executePayment(
    userPaymentDto: UserPaymentDto,
  ): Promise<UserPaymentResponseDto> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.userService.paymentUser(userPaymentDto);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to process payment');
    } finally {
      await queryRunner.release();
    }
  }
}
