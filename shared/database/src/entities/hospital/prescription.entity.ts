import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum PrescriptionStatus {
  DRAFT = 'draft',
  FINALIZED = 'finalized',
  DISPENSED = 'dispensed',
  CANCELLED = 'cancelled',
}

@Entity({ name: 'prescriptions' })
export class Prescription extends BaseEntity {
  @Column()
  patientId: string;

  @Column()
  doctorId: string;

  @Column({ nullable: true })
  appointmentId: string;

  // Values: draft | finalized | dispensed | cancelled
  @Column({ type: 'text', default: PrescriptionStatus.DRAFT })
  status: PrescriptionStatus;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  pdfUrl: string;
}
