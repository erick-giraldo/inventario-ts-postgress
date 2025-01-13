import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../role/role.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { ProfileType } from '../../utils/enums';

@Entity()
export class Profile extends AbstractEntity {
  @Column({ type: 'varchar' })
  readonly name: string;

  @Column({ type: 'text' })
  readonly description: string;

  @Column({ type: 'text' })
  readonly shortName: string;

  @Column({ type: 'varchar', default: ProfileType.USER })
  readonly type?: ProfileType;

  @ManyToMany(() => Role, (role) => role.profiles)
  @JoinTable({
    name: 'profiles_has_roles',
    joinColumn: {
      name: 'profile_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  readonly roles: Role[];
}
