export class ConcertDateResponse {
  constructor(
    public id: number,
    public concert_id: number,
    public date: string,
    public created_at: string,
  ) {}
}
