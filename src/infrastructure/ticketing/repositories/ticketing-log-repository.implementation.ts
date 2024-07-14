import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, InsertResult, Repository } from 'typeorm';
import { TicketingLogRepository } from '../../../domain/ticketing/interfaces/ticketing-log-repository.interface';
import { TicketLog } from '../entities/ticket-log.entity';

@Injectable()
export class TicketingLogRepositoryImpl implements TicketingLogRepository {
  constructor(
    @InjectRepository(TicketLog)
    private readonly ticketLogRepository: Repository<TicketLog>,
  ) {}

  async insert(
    ticketing_id: number,
    _manager?: EntityManager,
  ): Promise<TicketLog> {
    const manager = _manager ?? this.ticketLogRepository.manager;

    // 새로운 TicketLog 엔티티 생성
    const newLog = this.ticketLogRepository.create({ ticketing_id });

    // 엔티티 저장
    return await manager.save(newLog);
  }
}
