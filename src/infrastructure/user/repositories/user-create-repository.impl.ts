import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserCreateRepository } from '../../../domain/user/interfaces/user-create-repository.interface';
import { UserCreateDto } from '../../../domain/user/entites/user-create.entity';

@Injectable()
export class UserCreateRepositoryImpl implements UserCreateRepository {
  constructor(
    @InjectRepository(User)
    private readonly userCreateRepository: Repository<User>,
  ) {}

  async createUser(userCreateDto: UserCreateDto): Promise<void> {
    return await this.userCreateRepository.manager.transaction(
      async (manager) => {
        const newUser = new User();
        newUser.name = userCreateDto.name;
        await manager.save(newUser);
      },
    );
  }
  async insertUser(name: string, manager?: EntityManager): Promise<void> {
    const usedManager = manager ?? this.userCreateRepository.manager;
    const newUser = new User();
    newUser.name = name;
    await usedManager.save(newUser);
  }
}
