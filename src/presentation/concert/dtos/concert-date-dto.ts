import { ApiProperty } from '@nestjs/swagger';
export class ConcertResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The place of the concert',
  })
  place?: string;

  @ApiProperty({
    example: 10000,
    description: 'The price of the concert ticket',
  })
  price?: number;

  @ApiProperty({ example: 50, description: 'The limit count of attendees' })
  limit_count?: number;

  @ApiProperty({
    example: '2024-07-14T12:34:56Z',
    description: 'The date of the concert',
  })
  date?: Date;
}
