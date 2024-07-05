import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConcertDate } from '../../concerts/entities/concert-date.entity';
import { ConcertSeat } from '../../concerts/entities/concert-seat.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ticketing')
export class Ticketing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => ConcertDate)
  @JoinColumn({ name: 'concert_date_id' })
  concertDate: ConcertDate;

  @Column()
  concert_date_id: number;

  @ManyToOne(() => ConcertSeat)
  @JoinColumn({ name: 'concert_seat_id' })
  concertSeat: ConcertSeat;

  @Column()
  concert_seat_id: number;

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
