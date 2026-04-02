import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum LabOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity({ name: 'lab_orders' })
export class LabOrder extends BaseEntity {
  @Column()
  patientId: string;

  @Column()
  doctorId: string;

  @Column({ nullable: true })
  appointmentId: string;

  @Column()
  testName: string;

  // Values: pending | in_progress | completed | cancelled
  @Column({ type: 'text', default: LabOrderStatus.PENDING })
  status: LabOrderStatus;

  @Column({ nullable: true })
  notes: string;
}
