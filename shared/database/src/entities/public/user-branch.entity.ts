import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'user_branches', schema: 'public' })
@Unique(['userId', 'branchId'])
export class UserBranch extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  branchId: string;

  @Column()
  hospitalId: string;
}
