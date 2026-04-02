import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Entity({ name: 'appointments' })
export class Appointment extends BaseEntity {
  @Column()
  patientId: string;

  @Column()
  doctorId: string;

  @Column({ nullable: true })
  departmentId: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  // Values: pending | confirmed | in_progress | completed | cancelled | no_show
  @Column({ type: 'text', default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  cancelReason: string;

  @Column({ nullable: true })
  queuePosition: number;
}
