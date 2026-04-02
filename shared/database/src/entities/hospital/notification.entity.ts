import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum NotificationType {
  EMAIL = 'email',
  IN_APP = 'in_app',
  SMS = 'sms',
}

@Entity({ name: 'notifications' })
export class Notification extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  // Values: email | in_app | sms
  @Column({ type: 'text', default: NotificationType.IN_APP })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;
}
