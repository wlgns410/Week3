import { Injectable } from '@nestjs/common';
import { ConcertService } from '../services/concert-date.service';
import { ConcertResponseDto } from '../../../presentation/concert/dtos/concert-date-dto';
import { ConcertSeatResponseDto } from '../../../presentation/concert/dtos/concert-seat-dto';

@Injectable()
export class ConcertUseCase {
  constructor(private readonly concertService: ConcertService) {}

  async executeGetConcertList(
    concertId: number,
  ): Promise<ConcertResponseDto[]> {
    return await this.concertService.getConcertList(concertId);
  }

  async executeGetConcertSeatList(
    concertDetailId: number,
    date: Date,
  ): Promise<ConcertSeatResponseDto[]> {
    return await this.concertService.getConcertSeatList(concertDetailId, date);
  }
}
