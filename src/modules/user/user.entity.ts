import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { UserType } from './user-type.enum';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Profile } from '../profile/profile.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  readonly username: string;

  @Column({ type: 'varchar', nullable: true })
  readonly fullName?: string;

  @Column({ type: 'varchar', unique: true })
  readonly emailAddress: string;

  @Column({ type: 'boolean', default: false })
  readonly isEmailAddressVerified?: boolean;

  @Column({ type: 'varchar' })
  readonly password: string;

  @Column({ type: 'boolean', default: true })
  readonly isActive?: boolean;

  @Column({ type: 'varchar', default: true })
  readonly twoFaSeed?: string | null;

  @Column({ type: 'boolean', default: false })
  readonly isTwoFaEnabled?: boolean;

  @Column({ type: 'enum', enum: UserType, default: UserType.USER })
  readonly userType?: UserType;

  @ManyToMany(() => Profile)
  @JoinTable({
    name: 'users_has_profiles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'profile_id',
      referencedColumnName: 'id',
    },
  })
  readonly profiles?: Profile[];
}
