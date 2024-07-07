import { Test, TestingModule } from '@nestjs/testing';
import { TicketingController } from './ticketing.controller';

describe('TicketingController', () => {
  let ticketingController: TicketingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketingController],
    }).compile();

    ticketingController = module.get<TicketingController>(TicketingController);
  });

  describe('reserveSeat', () => {
    it('should return a successful reservation response', async () => {
      // Given
      const ticketingDto = {
        id: 1,
        userId: 1,
        concertDateId: 1,
        seatId: 1,
        price: 10000,
        date: '2024-07-01T12:34:56Z',
        seat: 1,
        concert: '콘서트',
        reservation_start_at: '2024-07-01T12:34:56Z',
        reservation_end_at: '2024-07-01T12:34:56Z',
      };

      // When
      const response = await ticketingController.reserveSeat(ticketingDto);

      // Then
      expect(response.statusCode).toBe(201);
      expect(response.message).toBe('success');
      expect(response.data).toEqual({
        id: 1,
        price: 10000,
        date: '2024-07-01T12:34:56Z',
        seat: 1,
        concert: '콘서트',
        reservation_start_at: '2024-07-01T12:34:56Z',
        reservation_end_at: '2024-07-01T12:34:56Z',
      });
    });
  });
});
