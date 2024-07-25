import { DataSource } from 'typeorm';
import { User } from '../infrastructure/user/entities/user.entity';

export class UserSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const users = Array.from({ length: 100 }, (_, i) => ({
      name: `Test${i + 1}`,
      balance: 10000,
    }));

    await userRepository.save(users);
  }
}
