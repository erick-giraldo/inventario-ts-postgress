import { DataSource, MongoRepository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { ObjectId } from 'mongodb'; // Importa ObjectId
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';

@Injectable()
export class RoleRepository extends MongoRepository<Role> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
  ) {
    super(Role, dataSource.mongoManager);
  }

  async findAll() {
    return this.find();
  }

  async store(
    entity: Omit<Role, keyof AbstractEntity>,
  ): Promise<Role & AbstractEntity> {
    const role = this.create(entity); // Crea una instancia de Role
    return this.save(role); // Guarda y retorna el rol creado
  }

  async updateById(
    id: string,
    entity: Omit<Partial<Role>, keyof AbstractEntity>,
  ): Promise<void> {
    await this.update({ id: new ObjectId(id) }, entity); // Convierte id a ObjectId
  }

  async deleteById(id: string): Promise<void> {
    await this.delete(new ObjectId(id)); // Convierte id a ObjectId
  }

  async restoreById(id: string): Promise<void> {
    // Implementar lógica para restaurar según tus requisitos
  }

  async getAll() {
    return this.find({
      relations: {
        profiles: true,
      },
    });
  }

  async findByName(name: string) {
    return this.findOne({
      where: {
        name,
      },
      relations: {
        profiles: true,
      },
    });
  }

  async findById(id: ObjectId) {
    return await this.findOneBy({ _id: id });
  }
}
