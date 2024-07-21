import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketingRepository } from '../../../domain/ticketing/interfaces/ticketing-repository.interface';
import { EntityManager, LessThan, Repository } from 'typeorm';
import { Ticketing, SeatStatus } from '../entities/ticketing.entity';

@Injectable()
export class TicketingRepositoryImplementation implements TicketingRepository {
  constructor(
    @InjectRepository(Ticketing)
    private readonly ticketing: Repository<Ticketing>,
  ) {}

  async insert(ticketing: Partial<Ticketing>): Promise<Ticketing> {
    const newTicket = this.ticketing.create(ticketing);
    return await this.ticketing.save(newTicket);
  }

  async findExpiredTickets(now: Date): Promise<Ticketing[]> {
    return this.ticketing.find({
      where: { status: SeatStatus.WAITING, expired_at: LessThan(now) },
    });
  }

  async changeExpiredTicketsStatus(expiredTickets: Ticketing[]): Promise<void> {
    for (const ticket of expiredTickets) {
      ticket.status = SeatStatus.CANCELLED;
      await this.ticketing.save(ticket);
    }
  }

  async findById(ticketingId: number): Promise<Ticketing | undefined> {
    return await this.ticketing.findOne({ where: { id: ticketingId } });
  }
}
