import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  UserRepositorySymbol,
  UserRepository,
} from '../../../domain/user/interfaces/user-repository.interface';
import {
  UserLogRepositorySymbol,
  UserLogRepository,
} from '../../../domain/user/interfaces/user-log-repository.interface';
import { QueueStatus } from '../../../presentation/user/dtos/user-queue-status-dto';
import {
  TransactionType,
  UserBalanceChargeDto,
  UserBalanceLogDto,
} from '../../../presentation/user/dtos/user-balance-dto';
import {
  UserQueueDto,
  UserQueueStatusDto,
} from '../../../presentation/user/dtos/user-queue-status-dto';
import {
  TicketingRepository,
  TicketingRepositorySymbol,
} from '../../../domain/ticketing/interfaces/ticketing-repository.interface';
import {
  UserPaymentDto,
  UserPaymentResponseDto,
} from '../../../presentation/user/dtos/user-payment-dto';
import { SeatStatus } from '../../../presentation/ticketing/dtos/ticketing-dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepository,
    @Inject(UserLogRepositorySymbol)
    private readonly userLogRepository: UserLogRepository,
    @Inject(TicketingRepositorySymbol)
    private readonly ticketingRepository: TicketingRepository,
  ) { }
  async createUser(name: string): Promise<void> {
    const userDto = { name };
    await this.userRepository.insert(userDto);
  }

  async getUserBalance(userId: number): Promise<number> {
    return await this.userRepository.getUserBalance(userId);
  }
  async checkUser(now: Date): Promise<void> {
    const expiredUsers = await this.userRepository.findExpiredUsers(now);

    if (expiredUsers.length > 0) {
      await Promise.all(
        expiredUsers.map(async (user) => {
          user.queue_status = QueueStatus.EXPIRED;
          user.estimated_wait_time = null;
          user.expires_at = null;
          await this.userRepository.insert(user);
        }),
      );
    }
  }

  async getQueueStatus(
    userId: number,
  ): Promise<UserQueueStatusDto | undefined> {
    return await this.userRepository.getQueueStatus(userId);
  }

  async chargeBalance(userBalanceDto: UserBalanceChargeDto): Promise<void> {
    const user = await this.userRepository.findUserById(userBalanceDto.userId);

    user.balance += userBalanceDto.balance;
    await this.userRepository.insert(user);

    // 수정필요
    const newUserLog: UserBalanceLogDto = {
      userId: userBalanceDto.userId,
      amount: userBalanceDto.balance,
      transactionType: TransactionType.CHARGE,
    };

    await this.userLogRepository.insert(newUserLog);
  }

  async createQueue(userQueueDto: UserQueueDto): Promise<void> {
    const user = await this.userRepository.findUserById(userQueueDto.userId);

    const currentOrder = await this.userRepository.getNextOrder();
    const estimatedWaitTime = currentOrder * 10; // 1명당 대기시간 10초씩 기다린다고 가정
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 만료시간은 현재 시간으로부터 5분 후

    user.queue_status = QueueStatus.ACTIVE;
    user.currentOrder = currentOrder;
    user.estimated_wait_time = estimatedWaitTime;
    user.expires_at = expiresAt;

    await this.userRepository.insert(user);
  }

  async paymentUser(
    userPaymentDto: UserPaymentDto,
  ): Promise<UserPaymentResponseDto> {
    const { userId, ticketingId } = userPaymentDto;

    // 사용자 조회
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 티켓 조회
    const ticketing = await this.ticketingRepository.findById(ticketingId);
    if (!ticketing) {
      throw new NotFoundException('Ticket not found');
    }

    // 현재 시간 확인
    const now = new Date();
    if (now > ticketing.expired_at) {
      throw new BadRequestException('The payment window has expired');
    }

    // 사용자 잔액 확인
    if (user.balance < ticketing.price) {
      throw new BadRequestException('Insufficient balance');
    }

    // 티켓 상태 업데이트
    ticketing.status = SeatStatus.CONFIRMED;
    await this.ticketingRepository.insert(ticketing);

    // 잔액 로그 기록
    const userBalanceLog = new UserBalanceLogDto();
    userBalanceLog.userId = userId;
    userBalanceLog.amount = ticketing.price;
    userBalanceLog.transactionType = TransactionType.USE;
    await this.userLogRepository.insert(userBalanceLog);

    // 사용자 잔액 차감 && 유저 토큰 만료 처리
    user.balance -= ticketing.price;
    user.queue_status = QueueStatus.EXPIRED;
    user.estimated_wait_time = null;
    user.expires_at = null;
    user.currentOrder = null;
    await this.userRepository.insert(user);

    // 응답 DTO 생성
    const paymentResponse: UserPaymentResponseDto = {
      balance: user.balance,
    };

    return paymentResponse;
  }
}
