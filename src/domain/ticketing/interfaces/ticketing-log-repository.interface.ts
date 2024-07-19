import { EntityManager } from 'typeorm';
import { TicketLog } from '../../../infrastructure/ticketing/entities/ticket-log.entity';

export const TicketingLogRepositorySymbol = Symbol.for(
  'TicketingLogRepository',
);

export interface TicketingLogRepository {
  insert(ticketing_id: number, _manager?: EntityManager): Promise<TicketLog>;
}
