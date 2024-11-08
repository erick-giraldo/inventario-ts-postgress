import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { ProfileType } from '../../utils/enums';
import { Role } from '../role/role.entity';

@Entity()
export class Profile extends AbstractEntity {
  @Column()
  readonly name: string;

  @Column()
  readonly description: string;

  @Column()
  readonly shortName: string;

  @Column({ default: ProfileType.USER })
  readonly type?: ProfileType;

  @Column()
  readonly roles: string;
}
