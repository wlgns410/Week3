import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TicketingService } from '../services/ticketing.service';
import { TicketResponseDto } from '../../../presentation/ticketing/dtos/ticketing-dto';
import { TicketDto } from '../../../presentation/ticketing/dtos/ticketing-dto';
import { AppDataSource } from '../../../config/typeorm-config';
import { RedisLockService } from '../../../redis/redis-config';

@Injectable()
export class ReservationTicketUseCase {
  constructor(
    @Inject() private readonly ticketingService: TicketingService,
    private readonly redisService: RedisLockService,
  ) {}

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

    const lockKey = `concert:${ticketDto.userId}`;

    try {
      const lockAcquired = await this.redisService.acquireLock(lockKey);
      if (!lockAcquired) {
        throw new InternalServerErrorException('Could not acquire lock');
      }

      try {
        const result = await this.ticketingService.reservationTicket(
          queryRunner.manager,
          ticketDto,
        );
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException('Failed to reserve ticket');
      } finally {
        await this.redisService.releaseLock(lockKey);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to execute reservation with lock',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
