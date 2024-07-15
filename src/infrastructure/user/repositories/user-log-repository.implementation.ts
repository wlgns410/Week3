import { EntityManager, Repository } from 'typeorm';
import { UserBalanceLog } from '../entities/user-balance-log.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogRepository } from '../../../domain/user/interfaces/user-log-repository.interface';

@Injectable()
export class UserLogRepositoryImplementation implements UserLogRepository {
  constructor(
    @InjectRepository(UserBalanceLog)
    private readonly userLogRepository: Repository<UserBalanceLog>,
  ) {}

  async insert(
    useLogDto: Partial<UserBalanceLog>,
    manager?: EntityManager,
  ): Promise<void> {
    const usedManager = manager ?? this.userLogRepository.manager;
    await usedManager.save(useLogDto.user_id);
  }

  async getById(
    id: number,
    manager?: EntityManager,
  ): Promise<UserBalanceLog | undefined> {
    const usedManager = manager ?? this.userLogRepository.manager;
    return await usedManager.findOne(UserBalanceLog, { where: { id } });
  }

  async findAll(manager?: EntityManager): Promise<UserBalanceLog[]> {
    const usedManager = manager ?? this.userLogRepository.manager;
    return await usedManager.find(UserBalanceLog);
  }
}
