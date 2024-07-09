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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  balance: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 255, nullable: true })
  token: string;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    nullable: true,
  })
  queue_status: QueueStatus;

  @Column({ nullable: true })
  currentOrder: number;

  @Column({ nullable: true })
  estimated_wait_time: number;

  @Column({ nullable: true })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
