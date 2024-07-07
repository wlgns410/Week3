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
export class ConcertDate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Concert)
  @JoinColumn({ name: 'concert_id' })
  concert: Concert;

  @Column()
  concert_id: number;

  @Column()
  date: Date;

  @CreateDateColumn()
  created_at: Date;
}
