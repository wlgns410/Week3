import { Test, TestingModule } from '@nestjs/testing';
import { UserBalanceService } from '../services/user-balance-charge.service';
import { UserBalanceRepository } from '../../../domain/user/interfaces/user-charge-repository.interface';
import { UserBalanceChargeDto } from '../../../domain/user/entites/user-charge-balance.entity';

// Mock repository
const mockUserBalanceRepository = {
  chargeBalance: jest.fn(),
};

describe('UserBalanceService', () => {
  let userBalanceService: UserBalanceService;
  let userBalanceRepository: UserBalanceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBalanceService,
        {
          provide: 'UserBalanceRepository',
          useValue: mockUserBalanceRepository,
        },
      ],
    }).compile();

    userBalanceService = module.get<UserBalanceService>(UserBalanceService);
    userBalanceRepository = module.get<UserBalanceRepository>(
      'UserBalanceRepository',
    );
  });

  it('should be defined', () => {
    expect(userBalanceService).toBeDefined();
  });

  describe('chargeBalance', () => {
    it('should call chargeBalance with correct parameters', async () => {
      const userBalanceDto: UserBalanceChargeDto = {
        userId: 1,
        balance: 100,
      };

      await userBalanceService.chargeBalance(userBalanceDto);

      expect(userBalanceRepository.chargeBalance).toHaveBeenCalledWith(
        userBalanceDto,
      );
    });

    it('should throw an error if user not found', async () => {
      const userBalanceDto: UserBalanceChargeDto = {
        userId: 1,
        balance: 100,
      };

      mockUserBalanceRepository.chargeBalance.mockImplementationOnce(() => {
        throw new Error('User not found');
      });

      await expect(
        userBalanceService.chargeBalance(userBalanceDto),
      ).rejects.toThrow('User not found');
    });
  });
});
