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
import { SupplierService } from './supplier.service';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { Authentication } from '../authentication/decorators/authentication.decorator';
import { ReturnSupplierDto } from './dto/return-supplier.dto';
import { supplierPaginateConfig } from './supplier-paginate-config';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';


@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkPaginatedResponse(ReturnSupplierDto, supplierPaginateConfig)
  @ApiPaginationQuery(supplierPaginateConfig)
  @Authentication()
  async getPaginated(@Paginate() query: PaginateQuery) {
    return await this.supplierService.getPaginate(query);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Authentication()
  @MapResponseToDto(ReturnSupplierDto)
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    return await this.supplierService.save(createSupplierDto);
  }

  @Patch(':id')
  @Authentication()
  @MapResponseToDto(ReturnSupplierDto)
  update(@Param('id') id: string, @Body() data: UpdateSupplierDto) {
    return this.supplierService.update(id, data);
  }

  @Post('activate/:id')
  @Authentication()
  @MapResponseToDto(ReturnSupplierDto)
  activate(@Param('id') id: string) {
    return this.supplierService.activate(id);
  }
}
