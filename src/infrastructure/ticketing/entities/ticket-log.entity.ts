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
  @JoinColumn({ name: 'ticketingId' })
  ticketing: Ticketing;

  @Column()
  ticketingId: number;

  @CreateDateColumn()
  createdAt: Date;
}
