import { AppDataSource } from '../config/typeorm-config';
import { ConcertSeed } from './concert.seed';
import { ConcertDetailSeed } from './concertDetail.seed';

const runSeeds = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    const concertSeed = new ConcertSeed();
    await concertSeed.run(AppDataSource);

    const concertDetailSeed = new ConcertDetailSeed();
    await concertDetailSeed.run(AppDataSource);

    console.log('Seeding completed!');
  } catch (err) {
    console.error('Error running seeds:', err);
  } finally {
    await AppDataSource.destroy();
    console.log('Data Source has been destroyed!');
  }
};

runSeeds();
