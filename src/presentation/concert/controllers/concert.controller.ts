import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ConcertUseCase } from '../../../application/concert/use-case/concert-detail.use-case';
import { ConcertResponseDto } from '../dtos/concert-date-response.entity';
import { ConcertSeatResponseDto } from '../dtos/concert-seat-response.entity';
import { ApiResponse } from '../../../common/api-response';

@ApiTags('concerts')
@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertUseCase: ConcertUseCase) {}

  @ApiOperation({ summary: 'Get a list of concerts' })
  @ApiQuery({
    name: 'concertId',
    required: true,
    type: Number,
    description: 'The ID of the concert',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'List of concerts retrieved successfully',
    type: [ConcertResponseDto],
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
      },
    },
  })
  @Get('list')
  async getConcertList(
    @Query('concertId') concertId: number,
  ): Promise<ApiResponse<ConcertResponseDto[]>> {
    const concertList =
      await this.concertUseCase.executeGetConcertList(concertId);
    return new ApiResponse<ConcertResponseDto[]>(200, 'success', concertList);
  }

  @ApiOperation({ summary: 'Get a list of concert seats' })
  @ApiQuery({
    name: 'concertDetailId',
    required: true,
    type: Number,
    description: 'The ID of the concert detail',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    description: 'The date of the concert',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'List of concert seats retrieved successfully',
    type: [ConcertSeatResponseDto],
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
      },
    },
  })
  @Get('seats')
  async getConcertSeatList(
    @Query('concertDetailId') concertDetailId: number,
    @Query('date') date: Date,
  ): Promise<ApiResponse<ConcertSeatResponseDto[]>> {
    const seatList = await this.concertUseCase.executeGetConcertSeatList(
      concertDetailId,
      date,
    );
    return new ApiResponse<ConcertSeatResponseDto[]>(200, 'success', seatList);
  }
}
