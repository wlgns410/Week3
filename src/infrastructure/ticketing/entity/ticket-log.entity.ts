import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Ticketing } from '../entity/ticketing.entity';

@Entity('ticket_log')
export class TicketLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticketing)
  @JoinColumn({ name: 'user_id' })
  ticketing: Ticketing;

  @Column()
  ticketing_id: number;

  @CreateDateColumn()
  created_at: Date;
}
