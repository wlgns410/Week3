import { QueueStatus } from '../../../infrastructure/user/entities/user.entity';

export class UserQueueDto {
  userId: number;
}

export class UserQueueStatusDto {
  queue_status?: QueueStatus;
  currentOrder?: number;
  estimated_wait_time?: number | null;
  expires_at?: Date | null;
}
