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

  @Column({ default: 0, nullable: true })
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
  queueStatus: QueueStatus;

  @Column({ nullable: true })
  currentOrder: number;

  @Column({ nullable: true })
  estimateWaitTime: number;

  @Column({ nullable: true })
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
