import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { TicketingLogRepository } from '../../../domain/ticketing/interfaces/ticketing-log-repository.interface';
import { TicketLog } from '../entities/ticket-log.entity';

@Injectable()
export class TicketingLogRepositoryImplementation
  implements TicketingLogRepository
{
  constructor(
    @InjectRepository(TicketLog)
    private readonly ticketLogRepository: Repository<TicketLog>,
  ) {}

  async insert(
    manager: EntityManager,
    ticketingId: number,
  ): Promise<TicketLog> {
    try {
      // 새로운 TicketLog 엔티티 생성
      const newLog = manager.create(TicketLog, { ticketingId });

      // 엔티티 저장
      const result = await manager.save(TicketLog, newLog);
      return result;
    } catch (error) {
      console.error('Error saving ticket log:', error);
      throw new Error('Failed to save ticket log');
    }
  }
}
