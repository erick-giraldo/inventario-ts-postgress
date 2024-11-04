import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserType } from './user-type.enum';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Profile } from '../profile/profile.entity';

@Entity()
export class User extends AbstractEntity {

  @Column({ type: 'varchar', unique: true })
  readonly username: string;

  @Column({ type: 'varchar', nullable: true })
  readonly fullName?: string;

  @Column({ type: 'varchar' })
  readonly emailAddress: string;

  @Column({ type: 'boolean', default: false })
  readonly isEmailAddressVerified?: boolean;

  @Column({ type: 'varchar' })
  readonly password: string;

  @Column({ type: 'boolean', default: true })
  readonly isActive?: boolean;

  @Column({ type: 'varchar', nullable: true })
  readonly twoFaSeed?: string | null;

  @Column({ type: 'boolean', default: false })
  readonly isTwoFaEnabled?: boolean;

  @Column({ type: 'enum', enum: UserType, default: UserType.CLIENT })
  readonly userType?: UserType;

  // @ManyToMany(() => Profile, { cascade: true }) // Puedes agregar cascade si lo deseas
  // @JoinTable({
  //   name: 'users_has_profiles',
  //   joinColumn: {
  //     name: 'user_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'profile_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // readonly profiles?: Profile[];
  @Column({ type: 'varchar', nullable: true })
  readonly profiles?: Profile[] | null;
}
