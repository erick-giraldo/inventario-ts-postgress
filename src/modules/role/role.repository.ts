import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { ObjectId } from 'mongodb'; // Importa ObjectId
import { IRepository } from '@/common/interfaces/repository.interface';

@Injectable()
export class RoleRepository
  extends Repository<Role>
  implements IRepository<Role>
{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }
  findById(id: string): Promise<(Role & AbstractEntity) | null> {
    throw new Error('Method not implemented.');
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
  ) {
    await this.update({ id }, entity);
  }

  async deleteById(id: string): Promise<void> {
    await this.delete(new ObjectId(id)); // Convierte id a ObjectId
  }

  async restoreById(id: string): Promise<void> {
    // Implementar lógica para restaurar según tus requisitos
  }

  async getAll() {
    return this.find();
  }

  async getById(id: string) {
    return await this.findOne({ where: { id } });
  }
}
