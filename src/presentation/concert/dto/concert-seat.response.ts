export class ConcertSeatResponse {
  constructor(
    public id: number,
    public concert_date_id: number,
    public limit_count: number,
    public available_seat: number,
    public place: number,
    public status: string,
  ) {}
}
