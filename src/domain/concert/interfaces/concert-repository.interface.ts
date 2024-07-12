import { ConcertDto } from '../entities/concert-date-request.entity';
import { ConcertResponseDto } from '../entities/concert-date-response.entity';

export interface ConcertRepository {
  getConcertList(concertDto: ConcertDto): Promise<ConcertResponseDto[]>;
}
