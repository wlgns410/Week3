import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QueueService } from '../services/queue.service';
import { UserQueueDto } from '../../../presentation/user/dtos/user-queue-status-dto';
import { AppDataSource } from '../../../config/typeorm-config';
import { ExceptionError } from '../../../common/exceptions';

@Injectable()
export class QueueUseCase {
  constructor(private readonly queueService: QueueService) {}

  async executeCreateQueue(userQueueDto: UserQueueDto): Promise<string> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const token = await this.queueService.createQueue(
        queryRunner.manager,
        userQueueDto,
      );
      await queryRunner.commitTransaction();
      return token;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw ExceptionError.serverError('Failed to create queue');
    } finally {
      await queryRunner.release();
    }
  }
  async executeGetWaitingQueuePosition(token: string): Promise<number | null> {
    try {
      return await this.queueService.getWatingQueuePosition(token);
    } catch (error) {
      throw ExceptionError.serverError('Failed to get queue position');
    }
  }

  async executeActivateTokens(): Promise<void> {
    try {
      await this.queueService.activateTokens();
    } catch (error) {
      throw ExceptionError.serverError('Failed to activate tokens');
    }
  }

  async executeValidateToken(token: string): Promise<boolean> {
    try {
      return await this.queueService.validateToken(token);
    } catch (error) {
      throw ExceptionError.serverError('Failed to validate token');
    }
  }

  async executeClearExpiredTokens(): Promise<void> {
    try {
      await this.queueService.clearExpiredTokens();
    } catch (error) {
      throw ExceptionError.serverError('Failed to clear expired tokens');
    }
  }
}
