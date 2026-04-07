import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AppBaseEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'deleted_by', nullable: true })
  deletedBy: string;
}

export abstract class BaseEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
