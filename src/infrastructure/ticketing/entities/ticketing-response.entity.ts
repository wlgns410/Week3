import { SeatStatus } from './ticketing.entity';

export class TicketResponseDto {
  title: string;
  place: number;
  price: number;
  status: SeatStatus;
  created_at: Date;
  expired_at: Date;
}
