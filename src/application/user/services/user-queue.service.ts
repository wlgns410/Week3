import { Inject, Injectable } from '@nestjs/common';
import { UserQueueOrderRepository } from '../../../domain/user/interfaces/user-queue-repository.interface';
import { UserQueueDto } from '../../../domain/user/entites/user-queue.entity';
import { UserQueueStatusDto } from '../../../domain/user/entites/user-queue.entity';

@Injectable()
export class UserQueueOrderService {
  constructor(
    @Inject('UserRepository')
    private readonly userQueueOrderRepository: UserQueueOrderRepository,
  ) {}

  async createQueue(userQueueDto: UserQueueDto): Promise<void> {
    this.userQueueOrderRepository.createQueue(userQueueDto);
  }

  async getQueueStatus(
    userQueueDto: UserQueueDto,
  ): Promise<UserQueueStatusDto | undefined> {
    return this.userQueueOrderRepository.getQueueStatus(userQueueDto);
  }
}
