import { SeatStatus } from './ticketing-dto.entity';

export class TicketingResponse {
  constructor(
    public id: number,
    public price: number,
    public date: string,
    public seat: number,
    public concert: string,
    public reservation_start_at: string,
    public reservation_end_at: string,
  ) {}
}

export class TicketResponseDto {
  title: string;
  place: number;
  price: number;
  status: SeatStatus;
  created_at: Date;
  expired_at: Date;
}
