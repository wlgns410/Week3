import { Inject, Injectable } from '@nestjs/common';
import { TicketingRepository } from '../../../domain/ticketing/interfaces/ticketing-repository.interface';
import { TicketDto } from '../../../domain/ticketing/entities/ticketing-request.entity';
import { TicketResponseDto } from '../../../domain/ticketing/entities/ticketing-response.entity';

@Injectable()
export class TicketingService {
  constructor(
    @Inject('TicketingRepository')
    private readonly ticketingRepository: TicketingRepository,
  ) {}

  async reservationTicket(ticketDto: TicketDto): Promise<TicketResponseDto> {
    return await this.ticketingRepository.reservationTicket(ticketDto);
  }
}
