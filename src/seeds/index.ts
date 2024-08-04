import { AppDataSource } from '../config/typeorm-config';
import { ConcertSeed } from './concert.seed';
import { UserSeed } from './user.seed';
import { ConcertDetailSeed } from './concertDetail.seed';
import { UserBalanceLogSeed } from './userLog.seed';
import { TicketingSeed } from './ticketing.seed';

export const runSeeds = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    const userSeed = new UserSeed();
    await userSeed.run(AppDataSource);

    // const userBalanceLogSeed = new UserBalanceLogSeed();
    // await userBalanceLogSeed.run(AppDataSource);

    // const concertSeed = new ConcertSeed();
    // await concertSeed.run(AppDataSource);

    // const concertDetailSeed = new ConcertDetailSeed();
    // await concertDetailSeed.run(AppDataSource);

    // const ticketingSeed = new TicketingSeed();
    // await ticketingSeed.run(AppDataSource);

    console.log('Seeding completed!');
  } catch (err) {
    console.error('Error running seeds:', err);
  } finally {
    await AppDataSource.destroy();
    console.log('Data Source has been destroyed!');
  }
};

runSeeds();
