export enum SeatStatus {
  WAITING = 'WAITING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

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

export class TicketDto {
  concertId: number;
  userId: number;
  concertDetailId: number;
  title: string;
  place: number;
  price: number;
  status: SeatStatus;
}
