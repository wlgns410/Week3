export class UserQueueStatusDto {
  queueStatus?: QueueStatus;
  currentOrder?: number;
  estimateWaitTime?: number | null;
  expiredAt?: Date | null;
}

export class UserQueueDto {
  userId: number;
}

export enum QueueStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  WAITING = 'WAITING',
}
