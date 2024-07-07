import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserQueueTokenResponse } from '../dto/user-queue-token.response';
import { UserBalanceResponse } from '../dto/user-balance.response';
import { ApiResponse } from '../../../common/api-response';

class CreateUserDto {
  name: string;
}

class ChargeBalanceDto {
  amount: number;
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

  @Patch(':id/balance')
  async chargeBalance(
    @Param('id') userId: string,
    @Body() chargeBalanceDto: ChargeBalanceDto,
  ): Promise<ApiResponse<null>> {
    console.log(userId, chargeBalanceDto);
    // 충전
    // 충전이력 로그 남기기

    return new ApiResponse<null>(204, 'Charge Success');
  }

  @Get(':id/balance')
  async getBalance(
    @Param('id') userId: string,
  ): Promise<ApiResponse<UserBalanceResponse>> {
    console.log(userId);
    const balance = new UserBalanceResponse(1, 10000, 'ACTIVE');

    return new ApiResponse<UserBalanceResponse>(200, 'success', balance);
  }

  @Post(':id/payment')
  async userPayment(@Param('id') userId: string): Promise<ApiResponse<null>> {
    console.log(userId);
    // 결제
    // 돈없으면 충전
    // 스케쥴러

    return new ApiResponse<null>(201, 'success');
  }
}
