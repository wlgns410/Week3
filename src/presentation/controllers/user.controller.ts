import { Body, Controller, Post } from '@nestjs/common';
import { UserQueueTokenResponse } from '../dtos/user-queue-token.response';
import { ApiResponse } from '../../common/api-response';

class CreateUserDto {
  name: string;
}

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

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<null>> {
    console.log(createUserDto);

    return new ApiResponse<null>(201, 'success');
  }
}
