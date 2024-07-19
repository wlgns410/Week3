import { EntityManager } from 'typeorm';
import { UserBalanceLog } from '../../../infrastructure/user/entities/user-balance-log.entity';

export const UserLogRepositorySymbol = Symbol.for('UserLogRepository');

export interface UserLogRepository {
  insert(useLogDto: Partial<UserBalanceLog>): Promise<void>;
  getById(id: number): Promise<UserBalanceLog | undefined>;
  findAll(): Promise<UserBalanceLog[]>;
}
