import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { Authentication } from '../authentication/decorators/authentication.decorator';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';

import { CustomerService } from './customer.service';
import { customerPaginateConfig } from './customer-paginate-config';
import { UpdateClientDto } from './dto/update-supplier.dto';
import { ReturnCustomerDto } from './dto/return-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkPaginatedResponse(ReturnCustomerDto, customerPaginateConfig)
  @ApiPaginationQuery(customerPaginateConfig)
  @Authentication()
  async getPaginated(@Paginate() query: PaginateQuery) {
    return await this.customerService.findPaginated(query);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Authentication()
  @MapResponseToDto(ReturnCustomerDto)
  async create(@Body() createClientDto: CreateCustomerDto) {
    return await this.customerService.save(createClientDto);
  }

  @Patch(':id')
  @Authentication()
  @MapResponseToDto(ReturnCustomerDto)
  update(@Param('id') id: string, @Body() data: UpdateClientDto) {
    return this.customerService.update(id, data);
  }

  @Post('activate/:id')
  @Authentication()
  @MapResponseToDto(ReturnCustomerDto)
  activate(@Param('id') id: string) {
    return this.customerService.activate(id);
  }
}
