// import { Test, TestingModule } from '@nestjs/testing';
// import { UserCreateService } from './user-create.service';
// import { UserCreateRepository } from '../../../domain/user/interfaces/user-create-repository.interface';
// import { UserCreateDto } from '../dtos/user-create.dto';

// // Mock repository
// const mockUserCreateRepository = {
//   createUser: jest.fn(),
// };

// describe('UserCreateService', () => {
//   let userCreateService: UserCreateService;
//   let userCreateRepository: UserCreateRepository;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserCreateService,
//         {
//           provide: 'UserCreateRepository',
//           useValue: mockUserCreateRepository,
//         },
//       ],
//     }).compile();

//     userCreateService = module.get<UserCreateService>(UserCreateService);
//     userCreateRepository = module.get<UserCreateRepository>(
//       'UserCreateRepository',
//     );
//   });

//   it('should be defined', () => {
//     expect(userCreateService).toBeDefined();
//   });

//   describe('createUser', () => {
//     it('should call userCreateRepository.createUser with correct parameters', async () => {
//       const userCreateDto: UserCreateDto = {
//         name: 'John Doe',
//       };

//       await userCreateService.createUser(userCreateDto);

//       expect(userCreateRepository.createUser).toHaveBeenCalledWith(
//         userCreateDto,
//       );
//     });
//   });
// });
