import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  HOSPITAL_ADMIN = 'hospital_admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  RECEPTIONIST = 'receptionist',
  PHARMACIST = 'pharmacist',
  LAB_TECHNICIAN = 'lab_technician',
  PATIENT = 'patient',
}

@Entity({ name: 'users', schema: 'public' })
export class User extends BaseEntity {
  @Column({ unique: true })
  supabaseId: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  // Values: super_admin | hospital_admin | doctor | nurse | receptionist | pharmacist | lab_technician | patient
  @Column({ type: 'text', default: UserRole.PATIENT })
  role: UserRole;

  @Column({ nullable: true })
  tenantId: string;

  @Column({ default: false })
  isActive: boolean;
}
