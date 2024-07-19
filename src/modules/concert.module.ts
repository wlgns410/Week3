import { Module } from '@nestjs/common';
import { ConcertController } from '../presentation/concert/controllers/concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertDetail } from '../infrastructure/concert/entities/concert-detail.entity';
import { ConcertDetailRepositoryImplementation } from '../infrastructure/concert/repositories/concert-repostiory.implementation';
import { ConcertService } from '../application/concert/services/concert-date.service';
import { ConcertDetailRepositorySymbol } from '../domain/concert/interfaces/concert-detail-repository.interface';
import { ConcertUseCase } from '../application/concert/use-case/concert-detail.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ConcertDetail])],
  controllers: [ConcertController],
  providers: [
    ConcertService,
    ConcertUseCase,
    {
      provide: ConcertDetailRepositorySymbol,
      useClass: ConcertDetailRepositoryImplementation,
    },
  ],
})
export class ConcertModule { }
