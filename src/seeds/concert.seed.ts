import { DataSource } from 'typeorm';
import { Concert } from '../infrastructure/concert/entities/concert.entity';

export class ConcertSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const concertRepository = dataSource.getRepository(Concert);

    const concerts = [
      {
        title: 'Summer Fest3',
        description: 'A fun summer music festival',
        createdAt: new Date(),
      },
    ];

    await concertRepository.save(concerts);
  }
}
