import { DataSource } from 'typeorm';
import { ConcertDetail } from '../infrastructure/concert/entities/concert-detail.entity';

export class ConcertDetailSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const concertDetailRepository = dataSource.getRepository(ConcertDetail);

    const concertDetails = [
      {
        concertId: 6,
        place: 'seoul',
        price: 5000,
        title: 'Summer Fest',
        limitCount: 50,
        availableSeat: 50,
        date: new Date('2024-08-01'),
        reservationStartDate: new Date('2024-07-25'),
        reservationEndDate: new Date('2024-07-31'),
        createdAt: new Date(),
      },
    ];

    await concertDetailRepository.save(concertDetails);
  }
}
