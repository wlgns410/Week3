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

  async insert(useLogDto: Partial<UserBalanceLog>): Promise<void> {
    const queryBuilder = this.userLogRepository
      .createQueryBuilder('userBalanceLog')
      .setLock('pessimistic_write');

    await queryBuilder
      .insert()
      .into(UserBalanceLog)
      .values(useLogDto)
      .execute();
  }

  async getById(id: number): Promise<UserBalanceLog | undefined> {
    return await this.userLogRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<UserBalanceLog[]> {
    return await this.userLogRepository.find();
  }
}
