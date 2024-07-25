import { EntityManager } from 'typeorm';
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
  findConcertDetailByIdWithLock(
    manager: EntityManager,
    concertDetailId: number,
  ): Promise<ConcertDetail | undefined>;
  findConcertDetailById(
    concertDetailId: number,
  ): Promise<ConcertDetail | undefined>;
  updateAvailableSeats(
    manager: EntityManager,
    concertDetailId: number,
    availableSeat: number,
  ): Promise<void>;
}
