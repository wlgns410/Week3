export class UserQueueStatusDto {
  queue_status?: QueueStatus;
  currentOrder?: number;
  estimated_wait_time?: number | null;
  expires_at?: Date | null;
}

export class UserQueueDto {
  userId: number;
}

export enum QueueStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}
