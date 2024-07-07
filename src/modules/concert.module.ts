import { Module } from '@nestjs/common';
import { ConcertController } from '../presentation/concert/controller/concert.controller';

@Module({
  controllers: [ConcertController],
  providers: [],
})
export class ConcertModule {}
