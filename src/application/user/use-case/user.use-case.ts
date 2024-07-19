import { Injectable } from '@nestjs/common';
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

@Injectable()
export class UserUseCase {
  constructor(private readonly userService: UserService) {}

  async executeCreateUser(name: string): Promise<void> {
    console.log('here2');
    await this.userService.createUser(name);
  }

  async executeGetUserBalance(userId: number): Promise<number> {
    return await this.userService.getUserBalance(userId);
  }

  @Transactional()
  async executeCheckUser(now: Date): Promise<void> {
    await this.userService.checkUser(now);
  }

  async executeGetQueueStatus(
    userId: number,
  ): Promise<UserQueueStatusDto | undefined> {
    return await this.userService.getQueueStatus(userId);
  }

  @Transactional()
  async executeChargeBalance(
    userBalanceDto: UserBalanceChargeDto,
  ): Promise<void> {
    await this.userService.chargeBalance(userBalanceDto);
  }

  @Transactional()
  async executeCreateQueue(userQueueDto: UserQueueDto): Promise<void> {
    await this.userService.createQueue(userQueueDto);
  }

  @Transactional()
  async executePayment(
    userPaymentDto: UserPaymentDto,
  ): Promise<UserPaymentResponseDto> {
    return await this.userService.paymentUser(userPaymentDto);
  }
}
