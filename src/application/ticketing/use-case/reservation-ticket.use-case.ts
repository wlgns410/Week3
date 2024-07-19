import { Inject, Injectable } from '@nestjs/common';
import { TicketingService } from '../services/ticketing.service';
import { TicketResponseDto } from '../../../presentation/ticketing/dtos/ticketing-dto';
import { TicketDto } from '../../../presentation/ticketing/dtos/ticketing-dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ReservationTicketUseCase {
  constructor(@Inject() private readonly ticketingService: TicketingService) {}

  @Transactional()
  async changeStatusExcute(now: Date): Promise<void> {
    await this.ticketingService.changeStatus(now);
  }

  @Transactional()
  async executeReservation(ticketDto: TicketDto): Promise<TicketResponseDto> {
    return await this.ticketingService.reservationTicket(ticketDto);
  }
}
