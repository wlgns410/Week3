import { Inject, Injectable } from '@nestjs/common';
import { TicketingService } from '../services/ticketing.service';
import { TicketDto } from '../../../domain/ticketing/entities/ticketing-request.entity';
import { TicketResponseDto } from '../../../domain/ticketing/entities/ticketing-response.entity';
import { DataSource, EntityManager } from 'typeorm';
import { typeormConfig } from '../../../config/typeorm-config';

@Injectable()
export class ReservationTicketUseCase {
  constructor(
    @Inject() private readonly ticketingService: TicketingService,
    private readonly dataSource: DataSource,
  ) {}

  // async reserve(ticketDto: TicketDto): Promise<TicketResponseDto> {
  //   return await this.ticketingService.reservationTicket(ticketDto);
  // }

  // async reservation(ticketDto: TicketDto): Promise<TicketResponseDto> {
  //   return await this.ticketingService.reservationTicket(ticketDto);
  // }

  async changeStatusExcute(now: Date): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      await this.ticketingService.changeStatus(now, manager);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
