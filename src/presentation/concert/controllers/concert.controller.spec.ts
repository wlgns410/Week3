import { Test, TestingModule } from '@nestjs/testing';
import { ConcertController } from './concert.controller';

describe('ConcertController', () => {
  let concertController: ConcertController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertController],
    }).compile();

    concertController = module.get<ConcertController>(ConcertController);
  });

  describe('getReservationDates', () => {
    it('should return a list of available reservation dates', async () => {
      const concertId = 101;
      const response = await concertController.getReservationDates(concertId);
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('success');
      expect(response.data[0].concert_id).toBe(concertId);
    });
  });

  describe('getConcertSeats', () => {
    it('should return a list of available seats', async () => {
      const concertDateId = 1;
      const response = await concertController.getConcertSeats(concertDateId);

      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('success');
      expect(response.data).toBeInstanceOf(Array);
      expect(response.data[0].concert_date_id).toBe(concertDateId);
      expect(response.data[0].limit_count).toBe(100);
      expect(response.data[0].available_seat).toBe(95);
      expect(response.data[0].status).toBe('available');
    });
  });
});
