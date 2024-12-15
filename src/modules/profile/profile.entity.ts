import { Entity, Column} from 'typeorm';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { ProfileType } from '../../utils/enums';
import { ObjectId } from 'mongodb';

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

  @Column({ type: 'array', nullable: true })
  readonly roles?: ObjectId[];
  
}
