import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConcertDetail } from '../../concert/entity/concert-detail.entity';
import { User } from '../../user/entity/user.entity';

@Entity('ticketing')
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

  @Column({ length: 20 })
  place: string;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: ['RESERVED', 'CONFIRMED', 'CANCELLED'],
  })
  status: string;

  @Column()
  reservation_start_at: Date;

  @Column()
  reservation_end_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expired_at: Date;
}
