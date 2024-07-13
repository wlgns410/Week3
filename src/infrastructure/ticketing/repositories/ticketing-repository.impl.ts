import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketingRepository } from '../../../domain/ticketing/interfaces/ticketing-repository.interface';
import { LessThan, Repository } from 'typeorm';
import { SeatStatus, Ticketing } from '../entities/ticketing.entity';
import { TicketLog } from '../entities/ticket-log.entity';
import { TicketDto } from '../../../domain/ticketing/entities/ticketing-request.entity';
import { TicketResponseDto } from '../../../domain/ticketing/entities/ticketing-response.entity';
import { User } from '../../user/entities/user.entity';
import { ConcertDetail } from '../../concert/entities/concert-detail.entity';
import { AppDataSource } from '../../../config/typeorm-config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TicketingRepositoryImpl implements TicketingRepository {
  constructor(
    @InjectRepository(Ticketing)
    private readonly ticketingRepository: Repository<Ticketing>,
    @InjectRepository(TicketLog)
    private readonly ticketLogRepository: Repository<TicketLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ConcertDetail)
    private readonly concertDetailRepository: Repository<ConcertDetail>,
  ) {}

  async reservationTicket(ticketDto: TicketDto): Promise<TicketResponseDto> {
    return await AppDataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: ticketDto.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.queue_status !== 'ACTIVE') {
        throw new BadRequestException('User is not in an active queue status');
      }

      const now = new Date();
      if (now.getTime() < user.estimated_wait_time) {
        throw new BadRequestException('User wait time has not passed');
      }

      const concertDetail = await manager.findOne(ConcertDetail, {
        where: { id: ticketDto.concertDetailId },
      });

      if (!concertDetail) {
        throw new NotFoundException('Concert detail not found');
      }

      if (concertDetail.available_seat <= 0) {
        throw new BadRequestException('No available seats');
      }

      if (
        now < concertDetail.reservation_start_date ||
        now > concertDetail.reservation_end_date
      ) {
        throw new BadRequestException(
          'Current time is not within the reservation period',
        );
      }

      // 남은 좌석 차감 및 할당
      const updatedAvailableSeat = concertDetail.available_seat - 1;

      // 예약 정보 생성
      const ticketing = manager.create(Ticketing, {
        user_id: ticketDto.userId,
        concert_detail_id: ticketDto.concertDetailId,
        title: concertDetail.title,
        place: updatedAvailableSeat, // 남은 좌석 수를 문자열로 변환하여 할당
        price: concertDetail.price,
        status: ticketDto.status,
        expired_at: new Date(now.getTime() + 5 * 60 * 1000), // 만료 시간 설정 (예: 5분 후)
      });

      await manager.save(Ticketing, ticketing);

      // 예약 로그 생성
      const ticketLog = manager.create(TicketLog, {
        ticketing_id: ticketing.id,
      });

      await manager.save(TicketLog, ticketLog);

      // 남은 좌석 차감
      concertDetail.available_seat = updatedAvailableSeat;
      await manager.save(ConcertDetail, concertDetail);

      // 응답 DTO 생성
      const ticketResponse: TicketResponseDto = {
        title: ticketing.title,
        place: ticketing.place,
        price: ticketing.price,
        status: ticketing.status,
        created_at: ticketing.created_at,
        expired_at: ticketing.expired_at,
      };

      return ticketResponse;
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cancelExpiredTickets() {
    await AppDataSource.transaction(async (manager) => {
      const now = new Date();
      const expiredTickets = await manager.find(Ticketing, {
        where: { status: SeatStatus.WAITING, expired_at: LessThan(now) },
      });

      for (const ticket of expiredTickets) {
        // 티켓 상태를 CANCELLED로 변경
        ticket.status = SeatStatus.CANCELLED;
        await manager.save(Ticketing, ticket);

        // 관련 콘서트의 available_seat 증가
        const concertDetail = await manager.findOne(ConcertDetail, {
          where: { id: ticket.concert_detail_id },
        });

        if (concertDetail) {
          concertDetail.available_seat += 1;
          await manager.save(ConcertDetail, concertDetail);
        }
      }
    });
  }
}
