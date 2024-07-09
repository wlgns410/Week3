import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Concert } from './concert.entity';

@Entity()
export class ConcertDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Concert)
  @JoinColumn({ name: 'concert_id' })
  concert: Concert;

  @Column()
  concert_id: number;

  @Column()
  place: number;

  @Column()
  price: number;

  @Column()
  limit_count: number;

  @Column()
  available_seat: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'date' })
  reservation_start_date: Date;

  @Column({ type: 'date' })
  reservation_end_date: Date;

  @CreateDateColumn()
  created_at: Date;
}
