import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum HospitalStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

@Entity({ name: 'hospitals', schema: 'public' })
export class Hospital extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'smallint', default: HospitalStatus.ACTIVE })
  status: HospitalStatus;
}
