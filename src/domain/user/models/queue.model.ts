import { LocalDateTime } from '../../../libs/types';
import { ExceptionError } from '../../../common/exceptions';
import { QueueStatus } from '../../../presentation/user/dtos/user-queue-status-dto';

interface Props {
  currentOrder: number;
  userId: string;
  queueStatus: QueueStatus;
  expiredAt: LocalDateTime;
}

export class Queue implements Props {
  currentOrder: number;
  userId: string;
  queueStatus: QueueStatus;
  expiredAt: LocalDateTime;

  private constructor(props: Props) {
    Object.assign(this, props);
  }

  static create = ({ userId }: Pick<Props, 'userId'>): Queue =>
    new Queue({
      currentOrder: 1,
      userId,
      queueStatus: QueueStatus.WAITING,
      expiredAt: LocalDateTime.now().plusMinutes(5),
    });

  static from = (props: Props): Queue => new Queue(props);

  static parse = (token: string): Queue =>
    Buffer.from(token, 'base64')
      .toString('utf-8')
      .split('@')
      .reduce(
        (queue, value, index) => {
          switch (index) {
            case 0:
              queue.currentOrder = Number(value);
              return queue;
            case 1:
              queue.userId = value;
              return queue;
            case 2:
              queue.expiredAt = LocalDateTime.parse(value);
              return queue;
            default:
              return queue;
          }
        },
        Queue.from({
          currentOrder: 0,
          userId: '',
          expiredAt: LocalDateTime.now(),
          queueStatus: QueueStatus.WAITING,
        }),
      )
      .validate();

  sign = (): string =>
    Buffer.from(
      `${this.currentOrder}@${this.userId}@${this.expiredAt.toString()}`,
    ).toString('base64');

  validate(): Queue {
    if (Number.isNaN(this.currentOrder) && this.userId === '') {
      throw ExceptionError.forbidden('잘못된 대기열 토큰입니다.');
    }

    return this;
  }

  checkAvailable(): boolean {
    if (this.expiredAt.isBeforeNow()) {
      throw ExceptionError.forbidden('만료된 대기열 토큰입니다.');
    }

    if (this.queueStatus === QueueStatus.WAITING) {
      throw ExceptionError.forbidden('아직 순번이 아닙니다.');
    }

    return true;
  }

  activate(): void {
    this.queueStatus = QueueStatus.ACTIVE;
  }

  expire(): void {
    this.queueStatus = QueueStatus.EXPIRED;
  }
}
