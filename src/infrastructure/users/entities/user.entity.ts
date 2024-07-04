import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum QueueStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  balance: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 255 })
  token: string;

  @Column({
    type: 'enum',
    enum: QueueStatus,
  })
  queue_status: QueueStatus;

  @Column()
  currentOrder: number;

  @Column()
  estimated_wait_time: number;

  @Column()
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
