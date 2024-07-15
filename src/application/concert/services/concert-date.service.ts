import { Inject, Injectable } from '@nestjs/common';
import {
  ConcertDetailRepository,
  ConcertDetailRepositorySymbol,
} from '../../../domain/concert/interfaces/concert-detail-repository.interface';
import { ConcertResponseDto } from '../../../presentation/concert/dtos/concert-date-response.entity';
import { ConcertSeatResponseDto } from '../../../presentation/concert/dtos/concert-seat-response.entity';

@Injectable()
export class ConcertService {
  constructor(
    @Inject(ConcertDetailRepositorySymbol)
    private readonly concertRepository: ConcertDetailRepository,
  ) {}

  async getConcertList(concertId: number): Promise<ConcertResponseDto[]> {
    return await this.concertRepository.getConcertList(concertId);
  }
  async getConcertSeatList(
    concertDetailId: number,
    date: Date,
  ): Promise<ConcertSeatResponseDto[]> {
    return await this.concertRepository.getConcertSeatList(
      concertDetailId,
      date,
    );
  }
}
