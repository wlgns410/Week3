import { EntityManager } from 'typeorm';
import { TicketLogResponseDto } from '../../../presentation/ticketing/dtos/ticketing-log-dto.entity';

export const TicketingLogRepositorySymbol = Symbol.for(
  'TicketingLogRepository',
);

export interface TicketingLogRepository {
  insert(
    ticketing_id: number,
    _manager?: EntityManager,
  ): Promise<TicketLogResponseDto>;
}
