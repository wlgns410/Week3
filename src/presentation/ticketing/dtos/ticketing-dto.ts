export enum SeatStatus {
  WAITING = 'WAITING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export class TicketingResponseDto {
  id: number;
  userId: number;
  concertDetailId: number;
  title: string;
  place: number;
  price: number;
  status: SeatStatus;
  createdAt: Date;
  expiredAt: Date;
}

export class TicketingRequestDto {
  user_id: number;
  concertDetailId: number;
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
  token?: string;
}

export class TicketingResponse {
  constructor(
    public id: number,
    public price: number,
    public date: string,
    public seat: number,
    public concert: string,
    public reservationStartAt: string,
    public reservationEndAt: string,
  ) {}
}

export class TicketResponseDto {
  title: string;
  place: number;
  price: number;
  status: SeatStatus;
  createdAt: Date;
  expiredAt: Date;
}

export class TicketingDto {
  userId: number;
  concertDetailId: number;
  title: string;
  place: number;
  price: number;
  expiredAt: Date;
}
