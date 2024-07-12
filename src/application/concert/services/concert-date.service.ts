import { Inject, Injectable } from '@nestjs/common';
import { ConcertRepository } from '../../../domain/concert/interfaces/concert-repository.interface';
import { ConcertDto } from '../../../domain/concert/entities/concert-date-request.entity';
import { ConcertResponseDto } from '../../../domain/concert/entities/concert-date-response.entity';

@Injectable()
export class ConcertService {
  constructor(
    @Inject('ConcertRepository')
    private readonly concertRepository: ConcertRepository,
  ) { }

  async getConcertList(concertDto: ConcertDto): Promise<ConcertResponseDto[]> {
    return await this.concertRepository.getConcertList(concertDto);
  }
}
