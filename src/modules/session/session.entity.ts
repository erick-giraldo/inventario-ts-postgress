import { Entity, Column, ObjectIdColumn, Index, BeforeInsert } from 'typeorm';
import { AbstractEntity } from '@/common/entities/abstract.entity';

@Entity()
export class Session extends AbstractEntity {
  @ObjectIdColumn()
  sessionId: string;

  @Column()
  @Index({ unique: false }) 
  userName: string;

  @Column()
  @Index({ expireAfterSeconds: 86400 }) // Expira después de 24 horas
  expiresAt: Date;

  // Valida que userName tenga un valor antes de insertar la sesión
  @BeforeInsert()
  checkUserName() {
    if (!this.userName) {
      throw new Error('userName is required and must be unique');
    }
  }
}
