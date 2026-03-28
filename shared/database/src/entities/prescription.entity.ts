import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PrescriptionStatus {
  DRAFT = 'draft',
  FINALIZED = 'finalized',
  DISPENSED = 'dispensed',
  CANCELLED = 'cancelled',
}

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column()
  doctorId: string;

  @Column({ nullable: true })
  appointmentId: string;

  @Column({ type: 'enum', enum: PrescriptionStatus, default: PrescriptionStatus.DRAFT })
  status: PrescriptionStatus;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  pdfUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
