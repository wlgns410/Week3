import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/user/interfaces/user-create-repository.interface';
import { UserCreateDto } from '../dtos/user-create.dto';

@Injectable()
export class UserCreateService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(userCreateDto: UserCreateDto): Promise<void> {
    this.userRepository.createUser(userCreateDto);
  }
}
