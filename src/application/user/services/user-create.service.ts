import { Inject, Injectable } from '@nestjs/common';
import { UserCreateRepository } from '../../../domain/user/interfaces/user-create-repository.interface';
import { UserCreateDto } from '../dtos/user-create.dto';

@Injectable()
export class UserCreateService {
  constructor(
    @Inject('UserRepository')
    private readonly userCreateRepository: UserCreateRepository,
  ) {}

  async createUser(userCreateDto: UserCreateDto): Promise<void> {
    this.userCreateRepository.createUser(userCreateDto);
  }
}
