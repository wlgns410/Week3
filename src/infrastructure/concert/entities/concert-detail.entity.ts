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
  @JoinColumn({ name: 'concertId' })
  concert: Concert;

  @Column()
  concertId: number;

  @Column({ type: 'varchar', length: 20 })
  place: string;

  @Column()
  price: number;

  @Column({ type: 'varchar', length: 20 })
  title: string;

  @Column()
  limitCount: number;

  @Column()
  availableSeat: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'date' })
  reservationStartDate: Date;

  @Column({ type: 'date' })
  reservationEndDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
