import { ConcertDto } from '../entities/concert-date-request.entity';
import { ConcertResponseDto } from '../entities/concert-date-response.entity';
import { ConcertSeatDto } from '../../../domain/concert/entities/concert-seat-request.entity';
import { ConcertSeatResponseDto } from '../../../domain/concert/entities/concert-seat-response.entity';
export interface ConcertRepository {
  getConcertList(concertDto: ConcertDto): Promise<ConcertResponseDto[]>;
  getConcertSeatList(
    concertSeatDto: ConcertSeatDto,
  ): Promise<ConcertSeatResponseDto[]>;
}
