// import { QueueStatus } from '../../../infrastructure/user/entities/user.entity';

export class UserQueueStatusDto {
  queue_status: string;
  currentOrder: number;
  estimated_wait_time: Date;
  expires_at: Date;
}

export class UserQueueDto {
  userId: number;
}

export enum QueueStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}
