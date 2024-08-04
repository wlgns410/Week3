import { DataSource } from 'typeorm';
import { Ticketing } from '../infrastructure/ticketing/entities/ticketing.entity';

export enum SeatStatus {
  WAITING = 'WAITING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export class TicketingSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const ticketingRepository = dataSource.getRepository(Ticketing);
    const batchSize = 10000;
    const totalRecords = 1000000;

    for (let i = 0; i < totalRecords / batchSize; i++) {
      const ticketings = [];
      for (let j = 0; j < batchSize; j++) {
        ticketings.push({
          userId: 21,
          concertDetailId: 6,
          title: `Summer Fest`,
          place: 1,
          price: 1000,
          expiredAt: new Date(),
          status: SeatStatus.CANCELLED,
        });
      }
      await ticketingRepository.save(ticketings);
      console.log(`Batch ${i + 1} saved`);
    }
    console.log('All records have been inserted.');
  }
}
