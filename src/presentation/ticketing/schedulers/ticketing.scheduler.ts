import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationTicketUseCase } from '../../../application/ticketing/use-case/reservation-ticket.use-case';

@Injectable()
export class TicketingScheduler {
  constructor(
    private readonly reservationTicketUseCase: ReservationTicketUseCase,
  ) {}

  // @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    await this.reservationTicketUseCase.changeStatusExcute(now);
  }
}
