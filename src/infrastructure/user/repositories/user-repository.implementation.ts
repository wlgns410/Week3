import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, LessThan, Repository } from 'typeorm';
import { QueueStatus, User } from '../entities/user.entity';
import { UserRepository } from '../../../domain/user/interfaces/user-repository.interface';

@Injectable()
export class UserRepositoryImplementation implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 서비스 측에서 주입하는대로 다양한 역할을 하게 될거임
  async insert(userDto: Partial<User>): Promise<void> {
    await this.userRepository.save(userDto);
  }

  async updateUser(
    manager: EntityManager,
    userDto: Partial<User>,
  ): Promise<void> {
    await manager.save(User, userDto);
  }

  async findUserByIdWithLock(
    manager: EntityManager,
    userId: number,
  ): Promise<User | undefined> {
    const user = await manager.findOne(User, {
      where: { id: userId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async findUserById(userId: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUserBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['balance'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.balance;
  }

  async findExpiredUsers(now: Date): Promise<User[]> {
    return await this.userRepository.find({
      where: { queueStatus: QueueStatus.ACTIVE, expiredAt: LessThan(now) },
    });
  }

  async getQueueStatus(userId: number): Promise<Partial<User> | undefined> {
    const user = this.userRepository.findOne({
      where: { id: userId },
      select: ['queueStatus', 'currentOrder', 'estimateWaitTime', 'expiredAt'],
    });
    if (!user) {
      throw new NotFoundException('User not found in queue');
    }

    return user;
  }

  async getNextOrder(): Promise<number> {
    const activeUsersCount = await this.userRepository.count({
      where: { queueStatus: QueueStatus.ACTIVE },
    });

    return activeUsersCount + 1;
  }
}
