import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { ReservationTicketUseCase } from '../../../application/ticketing/use-case/reservation-ticket.use-case';
import { TicketResponseDto } from '../dtos/ticketing-dto';
import { TicketDto } from '../dtos/ticketing-dto';
import { QueueGuard } from '../../../libs/guards';
import { User } from '../../../libs/decorators';

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
  @UseGuards(QueueGuard)
  @Post('reservation')
  async reserveSeat(
    @User() user: { userId: string; token: string },
    @Body() ticketDto: TicketDto,
  ): Promise<TicketResponseDto> {
    ticketDto.userId = Number(user.userId);
    ticketDto.token = user.token;

    const response =
      await this.reservationTicketUseCase.executeReservation(ticketDto);

    return response;
  }
}
