import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { ProfileType } from '../../utils/enums';
import { Role } from '../role/role.entity';

@Entity()
export class Profile extends AbstractEntity {
  @Column() // No es necesario especificar el tipo, MongoDB es flexible con los tipos
  readonly name: string;

  @Column() // Lo mismo aquí
  readonly description: string;

  @Column() // Lo mismo aquí
  readonly shortName: string;

  @Column({ default: ProfileType.CLIENT }) // Default sigue siendo válido
  readonly type?: ProfileType;

  @ManyToMany(() => Role, (role) => role.profiles, { cascade: true }) // Puedes agregar cascade si deseas que se guarden los roles automáticamente
  @JoinTable({
    name: 'profiles_has_roles', // Aunque esta tabla no se creará en MongoDB, TypeORM la manejará en términos de referencia.
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
