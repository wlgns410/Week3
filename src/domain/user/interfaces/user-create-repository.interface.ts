import { User } from '../entites/user-create.entity';

export interface UserRepository {
  createUser(user: User): Promise<User>;
}
