import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, LessThan, Repository } from 'typeorm';
import { QueueStatus, User } from '../entities/user.entity';
import { UserQueueStatusDto } from '../../../domain/user/entites/user-queue.entity';
import { UserRepository } from '../../../domain/user/interfaces/user-repository.interface';

@Injectable()
export class UserRepositoryImplementation implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 서비스 측에서 주입하는대로 다양한 역할을 하게 될거임
  async insert(userDto: Partial<User>, manager?: EntityManager): Promise<void> {
    const usedManager = manager ?? this.userRepository.manager;
    await usedManager.save(userDto);
  }

  async findUserById(
    userId: number,
    manager?: EntityManager,
  ): Promise<User | undefined> {
    const usedManager = manager ?? this.userRepository.manager;
    const user = await usedManager.findOne(User, { where: { id: userId } });

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

  async findExpiredUsers(now: Date, manager?: EntityManager): Promise<User[]> {
    const usedManager = manager ?? this.userRepository.manager;
    return await usedManager.find(User, {
      where: { queue_status: QueueStatus.ACTIVE, expires_at: LessThan(now) },
    });
  }

  async getQueueStatus(userId: number): Promise<Partial<User> | undefined> {
    const user = this.userRepository.findOne({
      where: { id: userId },
      select: [
        'queue_status',
        'currentOrder',
        'estimated_wait_time',
        'expires_at',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found in queue');
    }

    return user;
  }

  async getNextOrder(): Promise<number> {
    const activeUsersCount = await this.userRepository.count({
      where: { queue_status: QueueStatus.ACTIVE },
    });

    return activeUsersCount + 1;
  }
}
