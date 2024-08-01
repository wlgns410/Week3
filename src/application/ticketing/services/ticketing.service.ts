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
import {
  TicketResponseDto,
  TicketingDto,
} from '../../../presentation/ticketing/dtos/ticketing-dto';
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
  ) {}

  async reservationTicket(
    manager: EntityManager,
    ticketDto: TicketDto,
  ): Promise<TicketResponseDto> {
    const user = await this.userRepository.findUserByIdWithLock(
      manager,
      ticketDto.userId,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.queueStatus !== 'ACTIVE') {
      throw new BadRequestException('User is not in an active queue status');
    }

    const now = new Date();
    if (now.getTime() < user.estimateWaitTime) {
      throw new BadRequestException('User wait time has not passed');
    }

    const concertDetail =
      await this.concertDetailRepository.findConcertDetailByIdWithLock(
        manager,
        ticketDto.concertDetailId,
      );

    if (!concertDetail) {
      throw new NotFoundException('Concert detail not found');
    }

    if (concertDetail.availableSeat <= 0) {
      throw new BadRequestException('No available seats');
    }

    if (
      now < concertDetail.reservationStartDate ||
      now > concertDetail.reservationEndDate
    ) {
      throw new BadRequestException(
        'Current time is not within the reservation period',
      );
    }

    const expiredAt = new Date(Date.now() + 5 * 60 * 1000);
    // 예약 정보 생성
    const ticketing = await this.ticketingRepository.insert(manager, {
      userId: ticketDto.userId,
      concertDetailId: ticketDto.concertDetailId,
      title: concertDetail.title,
      place: concertDetail.availableSeat, // 남은 좌석 수를 문자열로 변환하여 할당
      price: concertDetail.price,
      expiredAt: expiredAt,
    });

    // 예약 로그 생성
    await this.ticketingLogRepository.insert(manager, ticketing.id);

    // 남은 좌석 차감 및 할당
    const updatedAvailableSeat = concertDetail.availableSeat - 1;
    // 남은 좌석 차감
    await this.concertDetailRepository.updateAvailableSeats(
      manager,
      concertDetail.id,
      updatedAvailableSeat,
    );

    // 응답 DTO 생성
    const ticketResponse: TicketResponseDto = {
      title: ticketing.title,
      place: ticketing.place,
      price: ticketing.price,
      status: ticketing.status,
      createdAt: ticketing.createdAt,
      expiredAt: ticketing.expiredAt,
    };

    return ticketResponse;
  }

  async changeStatus(now: Date): Promise<void> {
    const expiredTickets =
      await this.ticketingRepository.findExpiredTickets(now);

    // 만료된 티켓이 없는 경우
    if (!expiredTickets || expiredTickets.length === 0) {
      return; // 만료된 티켓이 없는 경우에는 상태 변경해줄 것이 없다는 뜻이니 에러 상태가 아님.
    }

    // 만료된 티켓이 있는 경우
    try {
      await this.ticketingRepository.changeExpiredTicketsStatus(expiredTickets);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to change status of expired tickets',
      );
    }
  }
}
