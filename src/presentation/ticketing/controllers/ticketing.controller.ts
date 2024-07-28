import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { ReservationTicketUseCase } from '../../../application/ticketing/use-case/reservation-ticket.use-case';
import { TicketResponseDto } from '../dtos/ticketing-dto';
import { TicketDto } from '../dtos/ticketing-dto';

@ApiTags('ticketings')
@Controller('ticketings')
export class TicketingController {
  constructor(
    private readonly reservationTicketUseCase: ReservationTicketUseCase,
  ) {}

  @ApiOperation({ summary: 'Reserve a seat for a concert' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Seat reserved successfully',
    type: TicketResponseDto,
  })
  @Post('reservation')
  async reserveSeat(@Body() ticketDto: TicketDto): Promise<TicketResponseDto> {
    return await this.reservationTicketUseCase.executeReservation(ticketDto);
  }
}
