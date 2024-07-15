import { EntityManager } from 'typeorm';
import { UserBalanceLog } from '../../../infrastructure/user/entities/user-balance-log.entity';

export const UserLogRepositorySymbol = Symbol.for('UserLogRepository');

export interface UserLogRepository {
  insert(
    useLogDto: Partial<UserBalanceLog>,
    manager?: EntityManager,
  ): Promise<void>;
  getById(
    id: number,
    manager?: EntityManager,
  ): Promise<UserBalanceLog | undefined>;
  findAll(manager?: EntityManager): Promise<UserBalanceLog[]>;
}
