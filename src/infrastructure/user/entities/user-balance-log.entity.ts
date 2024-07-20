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
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: [`CHARGE`, `USE`, `REFUND`] })
  transactionType: `CHARGE` | `USE` | `REFUND`;

  @CreateDateColumn()
  created_at: Date;
}
