import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ConcertDetail } from '../entities/concert-detail.entity';
import { ConcertRepository } from '../../../domain/concert/interfaces/concert-repository.interface';
import { ConcertDto } from '../../../domain/concert/entities/concert-date-request.entity';
import { ConcertResponseDto } from '../../../domain/concert/entities/concert-date-response.entity';
import { ConcertSeatDto } from '../../../domain/concert/entities/concert-seat-request.entity';
import { ConcertSeatResponseDto } from '../../../domain/concert/entities/concert-seat-response.entity';

@Injectable()
export class ConcertRepositoryImpl implements ConcertRepository {
  constructor(
    @InjectRepository(ConcertDetail)
    private readonly concertDetailRepository: Repository<ConcertDetail>,
  ) {}

  async getConcertList(concertDto: ConcertDto): Promise<ConcertResponseDto[]> {
    return await this.concertDetailRepository.find({
      select: ['place', 'price', 'limit_count', 'date'],
      where: {
        concert_id: concertDto.concertId,
        available_seat: MoreThan(0),
      },
    });
  }

  async getConcertSeatList(
    concertSeatDto: ConcertSeatDto,
  ): Promise<ConcertSeatResponseDto[]> {
    return await this.concertDetailRepository.find({
      select: ['available_seat', 'date'],
      where: {
        id: concertSeatDto.concertDetailId,
      },
    });
  }
}
