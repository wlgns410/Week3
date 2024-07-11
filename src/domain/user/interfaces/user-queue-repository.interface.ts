import { UserQueueDto } from '../entites/user-queue.entity';
import { UserQueueStatusDto } from '../../../domain/user/entites/user-queue.entity';

export interface UserQueueOrderRepository {
  createQueue(userQueueDto: UserQueueDto): Promise<void>;
  getQueueStatus(
    userQueueDto: UserQueueDto,
  ): Promise<UserQueueStatusDto | undefined>;
}
