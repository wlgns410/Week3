import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserQueueTokenResponse } from '../dtos/user-queue-token.response';
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
});
