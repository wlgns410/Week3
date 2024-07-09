import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Ticketing } from '../entities/ticketing.entity';

@Entity()
export class TicketLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticketing)
  @JoinColumn({ name: 'ticketing_id' })
  ticketing: Ticketing;

  @Column()
  ticketing_id: number;

  @CreateDateColumn()
  created_at: Date;
}
