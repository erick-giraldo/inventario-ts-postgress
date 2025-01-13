import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { CustomerRepository } from './customer.repository';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PG_UNIQUE_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { customerPaginateConfig } from './customer-paginate-config';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async findPaginated(query: PaginateQuery) {
    return paginate(query, this.customerRepository, customerPaginateConfig);
  }

  async save(data: CreateCustomerDto) {
    try {
      return await this.customerRepository.store({
        ...data,
        status: false,
      });
    } catch (e) {
      if (e.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException({
          message: 'Customer already exists',
        });
      }
      throw e;
    }
  }

  
  async update(id: string, data: Partial<Customer>) {
    await this.findById(id)
    return this.customerRepository.updateClient(id, data);
  }

  async activate(id: string) {
    const found = await this.findById(id)
    if (!found) {
      throw new ConflictException({ message: 'Customer does not exist' });
    }
    const newStatus = !found.status;
    return this.customerRepository.activate(id, newStatus);
  }
  
  async findById(id: string) {
    const found = await this.customerRepository.findOne({
      where: { id },
    });
    if (!found) {
      throw new ConflictException({ message: 'Customer does not exist' });
    }
    return found;
  }
}
