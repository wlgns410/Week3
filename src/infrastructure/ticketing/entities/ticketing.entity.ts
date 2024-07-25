import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
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
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => ConcertDetail)
  @JoinColumn({ name: 'concertDetailId' })
  concertDetail: ConcertDetail;

  @Column()
  concertDetailId: number;

  @Column({ type: 'varchar', length: 20 })
  title: string;

  @Column()
  place: number;

  @Column()
  price: number; // avaliableSeat

  @Column({
    type: 'enum',
    enum: SeatStatus,
    default: SeatStatus.WAITING,
  })
  status: SeatStatus;

  @CreateDateColumn()
  createdAt: Date; // 결제 가능 시간 시작으로도 사용 가능

  @Column()
  expiredAt: Date; // 결제 가능 시간 끝

  // @BeforeInsert()
  // setExpirationDate() {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() + 5);
  //   this.expiredAt = now;
  // }
}
