import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery } from 'nestjs-paginate';
import { FindOptionsWhere } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ClientRepository } from './client.repository';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientRepository)
    private readonly clientRepository: ClientRepository,
  ) {}

  async getPaginate(query: PaginateQuery) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const sort =
      query.sortBy?.reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {}) || {};

    const paginated = await this.clientRepository.findPaginated(
      page,
      limit,
      sort as Record<keyof Client, 'ASC' | 'DESC'>,
      query.filter as FindOptionsWhere<Client>,
    );

    return {
      results: paginated.items,
      meta: {
        itemsPerPage: limit,
        totalItems: paginated.count,
        currentPage: page,
        totalPages: Math.ceil(paginated.count / limit),
      },
    };
  }

  async save(data: CreateClientDto) {
    try {
      return await this.clientRepository.store({
        ...data,
        status: false,
      });
    } catch (e) {
      if (e.code === 11000) {
        const duplicateKeyMatch = e.message.match(/\{ (.+?) \}/);
        const duplicateKey = duplicateKeyMatch
          ? duplicateKeyMatch[1].replace(/["]/g, '')
          : 'unknown';
        throw new ConflictException({
          message: 'Client already exists',
          duplicateKey,
        });
      }

      throw e;
    }
  }

  
  async update(id: string, data: Partial<Client>) {
    const found = await this.findById(id)
    if (!found) {
      throw new ConflictException({ message: 'Category does not exist' });
    }
    return this.clientRepository.updateClient(id, data);
  }

  async activate(id: string) {
    const found = await this.findById(id)
    if (!found) {
      throw new ConflictException({ message: 'Category does not exist' });
    }
    const newStatus = !found.status;
    return this.clientRepository.activate(id, newStatus);
  }

  async findById(id: string) {
    return await this.clientRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }
}
