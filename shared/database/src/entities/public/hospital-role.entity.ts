import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'hospital_roles', schema: 'public' })
export class HospitalRole extends BaseEntity {
  @Column()
  hospitalId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', default: {} })
  permissions: Record<string, Record<string, boolean>>;

  @Column({ default: true })
  isActive: boolean;
}
