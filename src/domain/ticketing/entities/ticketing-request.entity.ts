import { SeatStatus } from '../../../infrastructure/ticketing/entities/ticketing.entity';

export class TicketDto {
  concertId: number;
  userId: number;
  concertDetailId: number;
  title: string;
  place: number;
  price: number;
  status: SeatStatus;
}
