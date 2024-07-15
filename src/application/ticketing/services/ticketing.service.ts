import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  TicketingRepository,
  TicketingRepositorySymbol,
} from '../../../domain/ticketing/interfaces/ticketing-repository.interface';
import { TicketDto } from '../../../domain/ticketing/entities/ticketing-request.entity';
import { TicketResponseDto } from '../../../domain/ticketing/entities/ticketing-response.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class TicketingService {
  constructor(
    @Inject(TicketingRepositorySymbol)
    private readonly ticketingRepository: TicketingRepository,
  ) {}

  // async reservationTicket(ticketDto: TicketDto): Promise<TicketResponseDto> {
  //   return await this.ticketingRepository.reservationTicket(ticketDto);
  // }

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
