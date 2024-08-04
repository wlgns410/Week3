import { DataSource } from 'typeorm';
import { User } from '../infrastructure/user/entities/user.entity';

export class UserSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const batchSize = 1000; // 배치 크기
    const totalUsers = 500000; // 총 생성할 사용자 수

    for (let i = 0; i < totalUsers; i += batchSize) {
      const users = Array.from({ length: batchSize }, (_, j) => ({
        name: `Test${i + j + 1}`,
        balance: 10000,
      }));

      await userRepository.save(users);
      console.log(`Inserted batch ${i / batchSize + 1}`);
    }

    console.log('All users inserted');
  }
}
