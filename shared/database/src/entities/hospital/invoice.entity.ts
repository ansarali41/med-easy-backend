import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIAL = 'partial',
  CANCELLED = 'cancelled',
}

@Entity({ name: 'invoices' })
export class Invoice extends BaseEntity {
  @Column()
  patientId: string;

  @Column({ nullable: true })
  appointmentId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  // Values: pending | paid | partial | cancelled
  @Column({ type: 'text', default: InvoiceStatus.PENDING })
  status: InvoiceStatus;

  @Column({ nullable: true })
  notes: string;
}
