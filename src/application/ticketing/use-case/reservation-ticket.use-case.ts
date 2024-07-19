import { Inject, Injectable } from '@nestjs/common';
import { TicketingService } from '../services/ticketing.service';
import { DataSource } from 'typeorm';
import { TicketResponseDto } from '../../../presentation/ticketing/dtos/ticketing-dto';
import { TicketDto } from '../../../presentation/ticketing/dtos/ticketing-dto';

@Injectable()
export class ReservationTicketUseCase {
  constructor(
    @Inject() private readonly ticketingService: TicketingService,
    private readonly dataSource: DataSource,
  ) { }

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

  async executeReservation(ticketDto: TicketDto): Promise<TicketResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      const result = await this.ticketingService.reservationTicket(
        ticketDto,
        manager,
      );

      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
