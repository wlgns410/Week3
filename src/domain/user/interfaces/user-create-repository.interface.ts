import { UserCreateDto } from '../entites/user-create.entity';

export const UserRepositorySymbol = Symbol.for('UserCreateRepository');

export interface UserCreateRepository {
  createUser(userCreateDto: UserCreateDto): Promise<void>;
  insertUser;
}
