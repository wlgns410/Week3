import { EntityManager } from 'typeorm';
import { TicketLog } from '../../../infrastructure/ticketing/entities/ticket-log.entity';

export const TicketingLogRepositorySymbol = Symbol.for(
  'TicketingLogRepository',
);

export interface TicketingLogRepository {
  insert(manager: EntityManager, ticketingId: number): Promise<TicketLog>;
}
