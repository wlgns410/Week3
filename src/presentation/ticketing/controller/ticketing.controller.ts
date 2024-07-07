import { Controller, Post, Body } from '@nestjs/common';
import { ApiResponse } from '../../../common/api-response';
import { TicketingResponse } from '../dto/ticketing.response';

class TicketingDto {
  id: number;
  userId: number;
  concertDateId: number;
  seatId: number;
  price: number;
  date: string;
  seat: number;
  concert: string;
  reservation_start_at: string;
  reservation_end_at: string;
}

@Controller('ticketing')
export class TicketingController {
  @Post(':ticketingId/reservation')
  async reserveSeat(
    @Body() ticketingDto: TicketingDto,
  ): Promise<ApiResponse<TicketingResponse>> {
    const ticketingData: TicketingResponse = {
      id: 1,
      price: 10000,
      date: '2024-07-01T12:34:56Z',
      seat: 1,
      concert: '콘서트',
      reservation_start_at: '2024-07-01T12:34:56Z',
      reservation_end_at: '2024-07-01T12:34:56Z',
    };

    return new ApiResponse<TicketingResponse>(201, 'success', ticketingData);
  }
}
