import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MongoRepository } from 'typeorm';
import { Profile } from './profile.entity';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { ObjectId } from 'mongodb';
import { RoleRepository } from '../role/role.repository';

@Injectable()
export class ProfileRepository extends MongoRepository<Profile> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
    private readonly roleRepository: RoleRepository,
  ) {
    super(Profile, dataSource.mongoManager);
  }

  async store(entity: Omit<Profile, keyof AbstractEntity>) {
    return await this.save(entity);
  }

  async updateById(
    id: string,
    entity: Partial<Omit<Profile, keyof AbstractEntity>>,
  ) {
    await this.update({ id: new ObjectId(id) }, entity);
  }

  async deleteById(id: string): Promise<void> {
    await this.delete(new ObjectId(id));
  }

  async findById(id: ObjectId) {
    const profiles = await this.findOneBy({ _id: id });
    const profileWithRoles = profiles?.roles
      ? await Promise.all(
          profiles.roles.map((roleId) => this.roleRepository.findById(roleId)),
        )
      : [];
    return { ...profiles, roles: profileWithRoles };
  }
}
