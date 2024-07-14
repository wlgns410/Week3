import { EntityManager } from 'typeorm';
import { TicketDto } from '../entities/ticketing-request.entity';
import { TicketResponseDto } from '../entities/ticketing-response.entity';
import {
  TicketingResponseDto,
  TicketingRequestDto,
} from '../entities/ticketing-dto.entity';

export const TicketingRepositorySymbol = Symbol.for('TicketingRepository');

export interface TicketingRepository {
  reservationTicket(ticketDto: TicketDto): Promise<TicketResponseDto>;

  insert(
    ticketing: TicketingRequestDto,
    manager?: EntityManager,
  ): Promise<TicketingResponseDto>;
  findExpiredTickets(
    now: Date,
    manager?: EntityManager,
  ): Promise<TicketingResponseDto[]>;
  changeExpiredTicketsStatus(
    expiredTickets: TicketingResponseDto[],
    manager?: EntityManager,
  ): Promise<void>;
}
