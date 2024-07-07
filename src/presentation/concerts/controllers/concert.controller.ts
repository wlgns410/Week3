import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ConcertDateResponse } from '../dtos/concert-date.response';
import { ConcertSeatResponse } from '../dtos/concert-seat.response';
import { ApiResponse } from '../../../common/api-response';

@Controller('concert')
export class ConcertController {
  @Get(':concertId/reservation/date')
  async getReservationDates(
    @Param('concertId') concertId: number,
  ): Promise<ApiResponse<ConcertDateResponse[]>> {
    const concertDates: ConcertDateResponse[] = [
      {
        id: 1,
        concert_id: concertId,
        date: '2024-07-01T19:00:00',
        created_at: '2024-06-01T10:00:00',
      },
    ];

    return new ApiResponse<ConcertDateResponse[]>(200, 'success', concertDates);
  }

  @Get('concertDate/:concertDateId/reservation/seat')
  async getConcertSeats(
    @Param('concertDateId') concertDateId: number,
  ): Promise<ApiResponse<ConcertSeatResponse[]>> {
    const seats: ConcertSeatResponse[] = [
      new ConcertSeatResponse(1, concertDateId, 100, 95, 1, 'available'),
    ];

    return new ApiResponse<ConcertSeatResponse[]>(200, 'success', seats);
  }
}
