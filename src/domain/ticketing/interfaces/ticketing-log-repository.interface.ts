import { EntityManager } from 'typeorm';
import { TicketLogResponseDto } from '../entities/ticketing-log-dto.entity';

export const TicketingLogRepositorySymbol = Symbol.for(
  'TicketingLogRepository',
);

export interface TicketingLogRepository {
  insert(
    ticketing_id: number,
    _manager?: EntityManager,
  ): Promise<TicketLogResponseDto>;
}
