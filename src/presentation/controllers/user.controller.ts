import { Controller, Post } from '@nestjs/common';
import { UserQueueTokenResponse } from '../dtos/user-queue-token.response';
import { ApiResponse } from '../../common/api-response';

@Controller('users')
export class UserController {
  @Post('queue-token')
  async issueUserQueue(): Promise<ApiResponse<UserQueueTokenResponse>> {
    const userQueueToken = new UserQueueTokenResponse(
      1,
      10,
      'tokentokentoken',
      new Date(Date.now() + 5 * 60 * 1000),
      'ACTIVE',
      5,
      new Date(),
    );

    return new ApiResponse<UserQueueTokenResponse>(
      201,
      'success',
      userQueueToken,
    );
  }
}
