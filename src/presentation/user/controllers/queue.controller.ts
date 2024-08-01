import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QueueUseCase } from '../../../application/user/use-case/queue.use-case';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { QueueGuard } from '../../../libs/guards';
import { User } from '../../../libs/decorators';
import { UserQueueDto } from '../dtos/user-queue-status-dto';

@ApiTags('users')
@Controller('users')
export class QueueController {
  constructor(private readonly queueUseCase: QueueUseCase) {}

  @ApiOperation({ summary: 'Issue a user queue token' })
  @Post('queue-token')
  async issueUserQueue(@Body() userQueueDto: UserQueueDto): Promise<string> {
    return await this.queueUseCase.executeCreateQueue(userQueueDto);
  }

  @ApiOperation({ summary: 'Get waiting queue position' })
  @UseGuards(QueueGuard)
  @Get('queue-position')
  async getWaitingQueuePosition(
    @User() { userId }: { userId: string },
  ): Promise<number | null> {
    return await this.queueUseCase.executeGetWaitingQueuePosition(userId);
  }
}
