import { UserQueueDto } from '../entites/user-queue.entity';

export interface UserQueueOrderRepository {
  createQueue(userQueueDto: UserQueueDto): Promise<void>;
}
