import { UserCreateDto } from '../entites/user-create.entity';

export interface UserRepository {
  createUser(userCreateDto: UserCreateDto): Promise<void>;
}
