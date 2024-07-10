import { UserCreateDto } from '../entites/user-create.entity';

export interface UserCreateRepository {
  createUser(userCreateDto: UserCreateDto): Promise<void>;
}
