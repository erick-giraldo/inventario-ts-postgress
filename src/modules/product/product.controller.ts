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
import { UpdateProductDto } from './dto/update-product.dto';

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
  @Authentication()
  @ApiOkResponse({ type: ReturnProductDto })
  async getById(@Param('id') id: string) {
    return await this.productService.getById(id);
  }

  @Patch(':id')
  @Authentication()
  @MapResponseToDto(ReturnProductDto)
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productService.update(id, data);
  }

  @Post('activate/:id')
  @Authentication()
  @MapResponseToDto(ReturnProductDto)
  activate(@Param('id') id: string) {
    return this.productService.activate(id);
  }

  @Delete(':id')
  @Authentication()
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
