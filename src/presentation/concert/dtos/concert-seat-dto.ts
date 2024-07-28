import { ApiProperty } from '@nestjs/swagger';

export class ConcertSeatResponseDto {
  @ApiProperty({
    example: '2024-07-14T12:34:56Z',
    description: 'The date of the concert',
  })
  date?: Date;

  @ApiProperty({ example: 50, description: 'The number of available seats' })
  availableSeat?: number;
}
