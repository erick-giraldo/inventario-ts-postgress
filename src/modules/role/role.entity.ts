import { Entity, Column, ManyToMany } from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';

@Entity()
export class Role extends AbstractEntity {
  @Column({ type: 'varchar' })
  readonly name: string;

  @Column({ type: 'varchar', default: 'user' })
  readonly type: string;

  @ManyToMany(() => Profile, (profile) => profile.roles)
  readonly profiles: Profile[];
}
