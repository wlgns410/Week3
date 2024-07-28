import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketingRepository } from '../../../domain/ticketing/interfaces/ticketing-repository.interface';
import { EntityManager, LessThan, Repository } from 'typeorm';
import { Ticketing, SeatStatus } from '../entities/ticketing.entity';
import { TicketingDto } from '../../../presentation/ticketing/dtos/ticketing-dto';
@Injectable()
export class TicketingRepositoryImplementation implements TicketingRepository {
  constructor(
    @InjectRepository(Ticketing)
    private readonly ticketingRepository: Repository<Ticketing>,
  ) {}

  async insert(
    manager: EntityManager,
    ticketingDto: Partial<Ticketing>,
  ): Promise<Ticketing> {
    try {
      // Save the entity
      const result = await manager.save(Ticketing, ticketingDto);

      return result;
    } catch (error) {
      console.error('Error saving ticketing:', error);
      throw new Error('Failed to save ticketing');
    }
  }

  async findExpiredTickets(now: Date): Promise<Ticketing[]> {
    return this.ticketingRepository.find({
      where: { status: SeatStatus.WAITING, expiredAt: LessThan(now) },
    });
  }

  async changeExpiredTicketsStatus(expiredTickets: Ticketing[]): Promise<void> {
    for (const ticket of expiredTickets) {
      ticket.status = SeatStatus.CANCELLED;
      await this.ticketingRepository.save(ticket);
    }
  }

  async findById(ticketingId: number): Promise<Ticketing | undefined> {
    return await this.ticketingRepository.findOne({
      where: { id: ticketingId },
    });
  }
}
