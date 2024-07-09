import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserBalanceLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column()
  amout: number;

  @Column({ type: 'enum', enum: [`CHARGE`, `USE`, `REFUND`] })
  transactionType: `CHARGE` | `USE` | `REFUND`;

  @CreateDateColumn()
  created_at: Date;
}
