import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserBalanceLog } from '../entities/user-balance-log.entity';
import {
  SeatStatus,
  Ticketing,
} from '../../ticketing/entities/ticketing.entity';
import { Repository } from 'typeorm';
import { UserPaymentRepository } from '../../../domain/user/interfaces/user-payment-repository.interface';
import { UserPaymentDto } from 'src/presentation/user/dtos/user-payment-request.entity';
import { UserPaymentResponseDto } from 'src/presentation/user/dtos/user-payment-response.entity';
import { AppDataSource } from 'src/config/typeorm-config';

@Injectable()
export class UserPaymentRepositoryImpl implements UserPaymentRepository {
  constructor(
    @InjectRepository(UserBalanceLog)
    private readonly userBalanceRepository: Repository<UserBalanceLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ticketing)
    private readonly ticketingRepository: Repository<Ticketing>,
  ) {}
  async paymentUser(
    userPaymentDto: UserPaymentDto,
  ): Promise<UserPaymentResponseDto> {
    return await AppDataSource.transaction(async (manager) => {
      const { userId, ticketingId } = userPaymentDto;

      // 사용자 조회
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 티켓 조회
      const ticketing = await manager.findOne(Ticketing, {
        where: { id: ticketingId },
      });
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

      // 사용자 잔액 차감
      user.balance -= ticketing.price;
      await manager.save(User, user);

      // 티켓 상태 업데이트
      ticketing.status = SeatStatus.CONFIRMED;
      await manager.save(Ticketing, ticketing);

      // 잔액 로그 기록
      const userBalanceLog = manager.create(UserBalanceLog, {
        user_id: userId,
        amount: ticketing.price,
        transactionType: 'USE',
      });
      await manager.save(UserBalanceLog, userBalanceLog);

      // 응답 DTO 생성
      const paymentResponse: UserPaymentResponseDto = {
        balance: user.balance,
      };

      return paymentResponse;
    });
  }
}
