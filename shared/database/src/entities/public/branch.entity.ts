import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'branches', schema: 'public' })
export class Branch extends BaseEntity {
  @Column()
  hospitalId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  isMainBranch: boolean;

  @Column({ default: true })
  isActive: boolean;
}
