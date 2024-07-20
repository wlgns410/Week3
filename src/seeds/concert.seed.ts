import { DataSource } from 'typeorm';
import { Concert } from '../infrastructure/concert/entities/concert.entity';

export class ConcertSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const concertRepository = dataSource.getRepository(Concert);

    const concerts = [
      {
        title: 'Summer Fest',
        description: 'A fun summer music festival',
        created_at: new Date(),
      },
    ];

    await concertRepository.save(concerts);
  }
}
