import { DataSource } from 'typeorm';
import { ConcertDetail } from '../infrastructure/concert/entities/concert-detail.entity';

export class ConcertDetailSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const concertDetailRepository = dataSource.getRepository(ConcertDetail);

    const concertDetails = [
      {
        concert_id: 1,
        place: 'Main Stage',
        price: 5000,
        title: 'Summer Fest Day 1',
        limit_count: 50,
        available_seat: 50,
        date: new Date('2024-08-01'),
        reservation_start_date: new Date('2024-07-25'),
        reservation_end_date: new Date('2024-07-31'),
        created_at: new Date(),
      },
    ];

    await concertDetailRepository.save(concertDetails);
  }
}
