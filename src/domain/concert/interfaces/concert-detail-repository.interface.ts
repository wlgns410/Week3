import { ConcertDetail } from '../../../infrastructure/concert/entities/concert-detail.entity';

export const ConcertDetailRepositorySymbol = Symbol.for(
  'ConcertDetailRepository',
);

export interface ConcertDetailRepository {
  getConcertList(concertId: number): Promise<Partial<ConcertDetail>[]>;
  getConcertSeatList(
    concertDetailId: number,
    date: Date,
  ): Promise<Partial<ConcertDetail>[]>;
  findConcertDetailById(
    concertDetailId: number,
  ): Promise<ConcertDetail | undefined>;
  updateAvailableSeats(
    concertDetailId: number,
    availableSeat: number,
  ): Promise<void>;
}
