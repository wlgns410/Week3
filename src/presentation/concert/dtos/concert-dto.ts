export interface ConcertDetailDto {
  id: number;
  concert_id: number;
  place: string;
  price: number;
  title: string;
  limit_count: number;
  available_seat: number;
  date: Date;
  reservation_start_date: Date;
  reservation_end_date: Date;
  created_at: Date;
}
