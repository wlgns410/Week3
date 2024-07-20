import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserUseCase } from '../../../application/user/use-case/user.use-case';
import { UserQueueDto } from '../../../presentation/user/dtos/user-queue-status-dto';
import { UserBalanceChargeDto } from '../../../presentation/user/dtos/user-balance-dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import {
  UserPaymentDto,
  UserPaymentResponseDto,
} from '../dtos/user-payment-dto';
import { ApiResponse } from '../../../common/api-response';

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
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    console.log('here1');
    await this.userUseCase.executeCreateUser(createUserDto.name);
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
  ): Promise<void> {
    const userBalanceDto = new UserBalanceChargeDto();
    userBalanceDto.userId = Number(userId);
    userBalanceDto.balance = chargeBalanceDto.amount;
    await this.userUseCase.executeChargeBalance(userBalanceDto);
  }

  @ApiOperation({ summary: 'Issue a user queue token' })
  @ApiBody({ type: UserQueueDto })
  @Post('queue-token')
  async issueUserQueue(@Body() userQueueDto: UserQueueDto): Promise<void> {
    await this.userUseCase.executeCreateQueue(userQueueDto);
  }

  @ApiOperation({ summary: 'User payment' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UserPaymentDto })
  @Post(':id/payment')
  async userPayment(
    @Param('id') userId: string,
    @Body() userPaymentDto: UserPaymentDto,
  ): Promise<UserPaymentResponseDto> {
    userPaymentDto.userId = Number(userId);
    return await this.userUseCase.executePayment(userPaymentDto);
  }
}
