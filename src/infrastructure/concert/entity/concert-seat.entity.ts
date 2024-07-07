import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConcertDate } from './concert-date.entity';

@Entity()
export class ConcertSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ConcertDate)
  @JoinColumn({ name: 'concert_date_id' })
  concertDate: ConcertDate;

  @Column()
  concert_date_id: number;

  place: number;

  @Column({ type: 'enum', enum: ['AVAILABLE', 'RESERVED', 'SOLD'] })
  status: string;

  @Column()
  limit_count: number;

  @Column()
  available_seat: number;

  @CreateDateColumn()
  created_at: Date;
}
