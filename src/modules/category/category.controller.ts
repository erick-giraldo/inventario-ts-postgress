import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Authentication } from '../authentication/decorators/authentication.decorator';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { categoryPaginateConfig } from './category-paginate-config';
import { ReturnCategoryDto } from './dto/return-category.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkPaginatedResponse(ReturnCategoryDto, categoryPaginateConfig)
  @ApiPaginationQuery(categoryPaginateConfig)
  @Authentication()
  async getPaginated(@Paginate() query: PaginateQuery) {
    return await this.categoryService.getPaginate(query);
  }

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
  @MapResponseToDto(ReturnCategoryDto)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.save(createCategoryDto);
  }
}
