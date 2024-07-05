import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserQueueTokenResponse } from '../dtos/user-queue-token.response';
import { UserBalanceResponse } from '../dtos/user-balance.response';
import { ApiResponse } from '../../common/api-response';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('유저 대기열 토큰 생성 및 조회', () => {
    it('유저가 대기열 토큰을 요청합니다.', async () => {
      // Given
      const userId = 1;

      // When
      const response = await userController.issueUserQueue();

      // Then
      expect(response).toBeInstanceOf(ApiResponse);
      expect(response.statusCode).toBe(201);
      expect(response.message).toBe('success');
      expect(response.data).toBeInstanceOf(UserQueueTokenResponse);
      expect(response.data.userId).toBe(userId);
      expect(response.data.currentOrder).toBe(10);
      expect(response.data.token).toBe('tokentokentoken');
    });
  });

  describe('유저 생성', () => {
    it('유저를 생성합니다.', async () => {
      // Given
      const createUserDto = { name: 'John Doe' };

      // When
      const response = await userController.createUser(createUserDto);

      // Then
      expect(response).toBeInstanceOf(ApiResponse);
      expect(response.statusCode).toBe(201);
      expect(response.message).toBe('success');
    });
  });

  describe('유저 계좌 충전', () => {
    it('계좌를 충전합니다.', async () => {
      // Given
      const userId = '123';

      // When
      const response = await userController.chargeBalance(userId, {
        amount: 100,
      });

      // Then
      expect(response).toBeInstanceOf(ApiResponse);
      expect(response.statusCode).toBe(204);
      expect(response.message).toBe('Charge Success');
    });
  });

  describe('유저 잔액 조회', () => {
    it('잔액을 조회합니다.', async () => {
      // Given
      const userId = '123';

      // When
      const response = await userController.getBalance(userId);

      // Then
      expect(response).toBeInstanceOf(ApiResponse);
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('success');
      expect(response.data).toBeInstanceOf(UserBalanceResponse);
    });
  });

  describe('유저 결제 성공', () => {
    it('결제를 시도합니다.', async () => {
      // Given
      const userId = '123';

      // When
      const response = await userController.userPayment(userId);

      // Then
      expect(response.statusCode).toBe(201);
      expect(response.message).toBe('success');
    });
  });
});
