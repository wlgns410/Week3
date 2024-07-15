import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ConcertDetail } from '../entities/concert-detail.entity';
import { ConcertDetailRepository } from '../../../domain/concert/interfaces/concert-detail-repository.interface';

@Injectable()
export class ConcertDetailRepositoryImpl implements ConcertDetailRepository {
  constructor(
    @InjectRepository(ConcertDetail)
    private readonly concertDetailRepository: Repository<ConcertDetail>,
  ) {}

  async getConcertList(concertId: number): Promise<Partial<ConcertDetail>[]> {
    return await this.concertDetailRepository.find({
      select: ['place', 'price', 'limit_count', 'date'],
      where: {
        concert_id: concertId,
        available_seat: MoreThan(0),
      },
    });
  }

  async getConcertSeatList(
    concertDetailId: number,
    date: Date,
  ): Promise<Partial<ConcertDetail>[]> {
    return await this.concertDetailRepository.find({
      select: ['available_seat', 'date'],
      where: {
        id: concertDetailId,
      },
    });
  }

  async findConcertDetailById(
    concertDetailId: number,
  ): Promise<ConcertDetail | undefined> {
    return await this.concertDetailRepository.findOne({
      where: { id: concertDetailId },
    });
  }
}
