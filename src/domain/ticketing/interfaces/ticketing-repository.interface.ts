import { EntityManager } from 'typeorm';
import { Ticketing } from '../../../infrastructure/ticketing/entities/ticketing.entity';

export const TicketingRepositorySymbol = Symbol.for('TicketingRepository');

export interface TicketingRepository {
  insert(ticketing: Partial<Ticketing>): Promise<Partial<Ticketing>>;
  findExpiredTickets(now: Date): Promise<Partial<Ticketing>[]>;
  changeExpiredTicketsStatus(
    expiredTickets: Partial<Ticketing>[],
  ): Promise<void>;
  findById(ticketingId: number): Promise<Ticketing | undefined>;
}
