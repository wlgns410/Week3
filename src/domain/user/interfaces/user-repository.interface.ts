import { EntityManager } from 'typeorm';
import { User } from '../../../infrastructure/user/entities/user.entity';

export const UserRepositorySymbol = Symbol.for('UserRepository');

export interface UserRepository {
  insert(userDto: Partial<User>, manager?: EntityManager): Promise<void>;
  findUserById(
    userId: number,
    manager?: EntityManager,
  ): Promise<User | undefined>;
  getUserBalance(userId: number): Promise<number>;
  findExpiredUsers(now: Date, manager?: EntityManager): Promise<User[]>;
  getQueueStatus(userId: number): Promise<Partial<User> | undefined>;
  getNextOrder(): Promise<number>;
}
