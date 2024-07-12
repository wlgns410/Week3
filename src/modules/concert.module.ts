import { Module } from '@nestjs/common';
import { ConcertController } from '../presentation/concert/controllers/concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertDetail } from '../infrastructure/concert/entities/concert-detail.entity';
import { ConcertRepositoryImpl } from '../infrastructure/concert/repositories/concert-repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([ConcertDetail])],
  controllers: [ConcertController],
  providers: [
    ConcertService,
    {
      provide: 'ConcertRepository',
      useClass: ConcertRepositoryImpl,
    },],
})
export class ConcertModule { }
