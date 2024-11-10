import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { Product } from './product.entity';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { ProductService } from './product.service';
import { productPaginateConfig } from './product-config';
import { ReturnProductDto } from './dto/return-product.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';
import { Authentication } from '../authentication/decorators/authentication.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'success',
        },
        data: {
          type: 'object',
          properties: {
            index: {
              type: 'number',
              format: 'number',
            },
            address: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  @Authentication()
  @MapResponseToDto(ReturnProductDto)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.save(createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication()
  @ApiOkPaginatedResponse(ReturnProductDto, productPaginateConfig)
  @ApiPaginationQuery(productPaginateConfig)
  async getPaginated(@Paginate() query: PaginateQuery) {
    return await this.productService.getPaginate(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkPaginatedResponse(ReturnProductDto, productPaginateConfig)
  @ApiPaginationQuery(productPaginateConfig)
  @Authentication()
  async getById(@Param('id') id: string) {
    return await this.productService.getById(id);
  }

  @Patch(':id')
  @Authentication()
  update(@Param('id') id: string, @Body() data: Partial<Product>) {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  @Authentication()
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
