import { Module } from '@nestjs/common';
import { ConcertController } from '../presentation/concerts/controllers/concert.controller';

@Module({
  controllers: [ConcertController],
  providers: [],
})
export class ConcertModule {}
