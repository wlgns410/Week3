import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TicketingService } from '../services/ticketing.service';
import { TicketResponseDto } from '../../../presentation/ticketing/dtos/ticketing-dto';
import { TicketDto } from '../../../presentation/ticketing/dtos/ticketing-dto';
import { Transactional } from 'typeorm-transactional';
import { AppDataSource } from '../../../config/typeorm-config';

@Injectable()
export class ReservationTicketUseCase {
  constructor(@Inject() private readonly ticketingService: TicketingService) {}

  async changeStatusExcute(now: Date): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.ticketingService.changeStatus(now);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to change status');
    } finally {
      await queryRunner.release();
    }
  }

  async executeReservation(ticketDto: TicketDto): Promise<TicketResponseDto> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.ticketingService.reservationTicket(ticketDto);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to reserve ticket');
    } finally {
      await queryRunner.release();
    }
  }
}
