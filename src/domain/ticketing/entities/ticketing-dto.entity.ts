import { SeatStatus } from '../../../infrastructure/ticketing/entities/ticketing.entity';

export class TicketingResponseDto {
  id: number;
  user_id: number;
  concert_detail_id: number;
  title: string;
  place: number;
  price: number;
  status: SeatStatus;
  created_at: Date;
  expired_at: Date;
}

export class TicketingRequestDto {
  user_id: number;
  concert_detail_id: number;
  title: string;
  place: number;
  price: number;
}
