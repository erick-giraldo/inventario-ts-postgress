import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
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
import { IdDto } from '@/common/dto/id.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';
import { Authentication } from '../authentication/decorators/authentication.decorator';
import { SessionGuard } from '../authentication/guards/session.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(SessionGuard)
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
  @MapResponseToDto(ReturnProductDto)
  //@Authentication()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.save(createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  @ApiOkPaginatedResponse(ReturnProductDto, productPaginateConfig)
  @ApiPaginationQuery(productPaginateConfig)
  @Authentication()
  async getPaginated(@Paginate() query: PaginateQuery) {
    return await this.productService.getPaginate(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Product>) {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
