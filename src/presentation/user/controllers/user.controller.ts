import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserUseCase } from '../../../application/user/use-case/user.use-case';
import { ApiResponse } from '../../../common/api-response';
import { UserQueueDto } from '../../../presentation/user/dtos/user-queue-status-dto';
import { UserBalanceChargeDto } from '../../../presentation/user/dtos/user-balance-dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserPaymentDto } from '../dtos/user-payment-request.entity';
import { UserPaymentResponseDto } from '../dtos/user-payment-response.entity';

class CreateUserDto {
  name: string;
}

class ChargeBalanceDto {
  amount: number;
}

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userUseCase: UserUseCase) {}

  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<null>> {
    await this.userUseCase.executeCreateUser(createUserDto.name);
    return new ApiResponse<null>(201, 'success');
  }

  @ApiOperation({ summary: 'Get user balance' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Get(':id/balance')
  async getBalance(@Param('id') userId: string): Promise<ApiResponse<number>> {
    const balance = await this.userUseCase.executeGetUserBalance(
      Number(userId),
    );
    return new ApiResponse<number>(200, 'success', balance);
  }

  @ApiOperation({ summary: 'Charge user balance' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: ChargeBalanceDto })
  @Patch(':id/balance')
  async chargeBalance(
    @Param('id') userId: string,
    @Body() chargeBalanceDto: ChargeBalanceDto,
  ): Promise<ApiResponse<null>> {
    const userBalanceDto = new UserBalanceChargeDto();
    userBalanceDto.userId = Number(userId);
    userBalanceDto.balance = chargeBalanceDto.amount;

    await this.userUseCase.executeChargeBalance(userBalanceDto);
    return new ApiResponse<null>(204, 'Charge Success');
  }

  @ApiOperation({ summary: 'Issue a user queue token' })
  @ApiBody({ type: UserQueueDto })
  @Post('queue-token')
  async issueUserQueue(
    @Body() userQueueDto: UserQueueDto,
  ): Promise<ApiResponse<null>> {
    await this.userUseCase.executeCreateQueue(userQueueDto);
    return new ApiResponse<null>(201, 'success');
  }

  @ApiOperation({ summary: 'User payment' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UserPaymentDto })
  @Post(':id/payment')
  async userPayment(
    @Param('id') userId: string,
    @Body() userPaymentDto: UserPaymentDto,
  ): Promise<ApiResponse<UserPaymentResponseDto>> {
    userPaymentDto.userId = Number(userId);
    const result = await this.userUseCase.executePayment(userPaymentDto);
    return new ApiResponse<UserPaymentResponseDto>(201, 'success', result);
  }
}
