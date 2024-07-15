import { Injectable } from '@nestjs/common';
import { ConcertService } from '../services/concert-date.service';
import { DataSource } from 'typeorm';
import { ConcertResponseDto } from '../../../presentation/concert/dtos/concert-date-response.entity';
import { ConcertSeatResponseDto } from '../../../presentation/concert/dtos/concert-seat-response.entity';

@Injectable()
export class ConcertUseCase {
  constructor(
    private readonly concertService: ConcertService,
    private readonly dataSource: DataSource,
  ) {}

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
