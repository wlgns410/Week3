import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConcertDetail } from '../../concert/entities/concert-detail.entity';
import { User } from '../../user/entities/user.entity';

export enum SeatStatus {
  WAITING = 'WAITING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Ticketing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => ConcertDetail)
  @JoinColumn({ name: 'concert_detail_id' })
  concertDetail: ConcertDetail;

  @Column()
  concert_detail_id: number;

  @Column({ length: 20 })
  title: string;

  @Column()
  place: number;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: SeatStatus,
  })
  status: SeatStatus;

  @CreateDateColumn()
  created_at: Date; // 결제 가능 시간 시작으로도 사용 가능

  @Column()
  expired_at: Date; // 결제 가능 시간 끝
}
