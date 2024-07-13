import { TicketDto } from '../entities/ticketing-request.entity';
import { TicketResponseDto } from '../entities/ticketing-response.entity';

export interface TicketingRepository {
  reservationTicket(ticketDto: TicketDto): Promise<TicketResponseDto>;
}
