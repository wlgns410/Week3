import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, MoreThan, Repository } from 'typeorm';
import { ConcertDetail } from '../entities/concert-detail.entity';
import { ConcertDetailRepository } from '../../../domain/concert/interfaces/concert-detail-repository.interface';

@Injectable()
export class ConcertDetailRepositoryImplementation
  implements ConcertDetailRepository
{
  constructor(
    @InjectRepository(ConcertDetail)
    private readonly concertDetailRepository: Repository<ConcertDetail>,
  ) {}

  async getConcertList(concertId: number): Promise<Partial<ConcertDetail>[]> {
    return await this.concertDetailRepository.find({
      select: ['place', 'price', 'limitCount', 'date'],
      where: {
        concertId: concertId,
        availableSeat: MoreThan(0),
      },
    });
  }

  async getConcertSeatList(
    concertDetailId: number,
  ): Promise<Partial<ConcertDetail>[]> {
    return await this.concertDetailRepository.find({
      select: ['availableSeat', 'date'],
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

  async findConcertDetailByIdWithLock(
    manager: EntityManager,
    concertDetailId: number,
  ): Promise<ConcertDetail | undefined> {
    return await manager.findOne(ConcertDetail, {
      where: { id: concertDetailId },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async updateAvailableSeats(
    manager: EntityManager,
    concertDetailId: number,
    availableSeat: number,
  ): Promise<void> {
    await manager.update(ConcertDetail, concertDetailId, {
      availableSeat: availableSeat,
    });
  }
}
