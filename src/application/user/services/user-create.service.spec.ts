import { Test, TestingModule } from '@nestjs/testing';
import { UserCreateService } from './user-create.service';
import { UserRepository } from '../../../domain/user/interfaces/user-create-repository.interface';
import { UserCreateDto } from '../dtos/user-create.dto';

// Mock repository
const mockUserRepository = {
  createUser: jest.fn(),
};

describe('UserCreateService', () => {
  let userCreateService: UserCreateService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCreateService,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userCreateService = module.get<UserCreateService>(UserCreateService);
    userRepository = module.get<UserRepository>('UserRepository');
  });

  it('should be defined', () => {
    expect(userCreateService).toBeDefined();
  });

  describe('createUser', () => {
    it('should call userRepository.createUser with correct parameters', async () => {
      const userCreateDto: UserCreateDto = {
        name: 'John Doe',
      };

      await userCreateService.createUser(userCreateDto);

      expect(userRepository.createUser).toHaveBeenCalledWith(userCreateDto);
    });
  });
});
