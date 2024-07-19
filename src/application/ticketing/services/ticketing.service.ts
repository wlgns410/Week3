import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  TicketingRepository,
  TicketingRepositorySymbol,
} from '../../../domain/ticketing/interfaces/ticketing-repository.interface';
import { EntityManager } from 'typeorm';
import { TicketResponseDto } from '../../../presentation/ticketing/dtos/ticketing-dto';
import { TicketDto } from '../../../presentation/ticketing/dtos/ticketing-dto';
import {
  TicketingLogRepository,
  TicketingLogRepositorySymbol,
} from '../../../domain/ticketing/interfaces/ticketing-log-repository.interface';
import {
  UserRepository,
  UserRepositorySymbol,
} from '../../../domain/user/interfaces/user-repository.interface';
import {
  ConcertDetailRepository,
  ConcertDetailRepositorySymbol,
} from '../../../domain/concert/interfaces/concert-detail-repository.interface';

@Injectable()
export class TicketingService {
  constructor(
    @Inject(TicketingRepositorySymbol)
    private readonly ticketingRepository: TicketingRepository,
    @Inject(TicketingLogRepositorySymbol)
    private readonly ticketingLogRepository: TicketingLogRepository,
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepository,
    @Inject(ConcertDetailRepositorySymbol)
    private readonly concertDetailRepository: ConcertDetailRepository,
  ) { }

  async reservationTicket(
    ticketDto: TicketDto,
    manager: EntityManager,
  ): Promise<TicketResponseDto> {
    const user = await this.userRepository.findUserById(
      ticketDto.userId,
      manager,
    );

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

    const concertDetail =
      await this.concertDetailRepository.findConcertDetailById(
        ticketDto.concertDetailId,
      );

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
    const ticketing = await this.ticketingRepository.insert(
      {
        user_id: ticketDto.userId,
        concert_detail_id: ticketDto.concertDetailId,
        title: concertDetail.title,
        place: updatedAvailableSeat, // 남은 좌석 수를 문자열로 변환하여 할당
        price: concertDetail.price,
        status: ticketDto.status,
        expired_at: new Date(now.getTime() + 5 * 60 * 1000), // 만료 시간 설정 (예: 5분 후)
      },
      manager,
    );

    // 예약 로그 생성
    await this.ticketingLogRepository.insert(ticketing.id, manager);

    // 남은 좌석 차감
    concertDetail.available_seat = updatedAvailableSeat;
    await manager.save(concertDetail);

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
  }

  async changeStatus(now: Date, manager?: EntityManager): Promise<void> {
    const expiredTickets = await this.ticketingRepository.findExpiredTickets(
      now,
      manager,
    );

    // 만료된 티켓이 없는 경우
    if (!expiredTickets || expiredTickets.length === 0) {
      // 만료된 티켓이 없는 경우에는 상태 변경해줄 것이 없다는 뜻이니 에러 상태가 아님.
      return;
    }

    // 만료된 티켓이 있는 경우인데, 상태 변경을 못시킨거는 에러임
    try {
      await this.ticketingRepository.changeExpiredTicketsStatus(
        expiredTickets,
        manager,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to change status of expired tickets',
      );
    }
  }
}
