import { EntityManager } from 'typeorm';
import { Ticketing } from '../../../infrastructure/ticketing/entities/ticketing.entity';

export const TicketingRepositorySymbol = Symbol.for('TicketingRepository');

export interface TicketingRepository {
  insert(
    ticketing: Partial<Ticketing>,
    manager?: EntityManager,
  ): Promise<Partial<Ticketing>>;
  findExpiredTickets(
    now: Date,
    manager?: EntityManager,
  ): Promise<Partial<Ticketing>[]>;
  changeExpiredTicketsStatus(
    expiredTickets: Partial<Ticketing>[],
    manager?: EntityManager,
  ): Promise<void>;
  findById(ticketingId: number): Promise<Ticketing | undefined>;
}
