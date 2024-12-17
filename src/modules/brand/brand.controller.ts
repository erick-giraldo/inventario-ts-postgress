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
import { Authentication } from '../authentication/decorators/authentication.decorator';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { ApiOkResponse } from '@nestjs/swagger';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';
import { ReturnBrandDto } from './dto/return-brand.dto';
import { brandPaginateConfig } from './brand-paginate-config';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkPaginatedResponse(ReturnBrandDto, brandPaginateConfig)
  @ApiPaginationQuery(brandPaginateConfig)
  @Authentication()
  async getPaginated(@Paginate() query: PaginateQuery) {
    return await this.brandService.getPaginate(query);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Authentication()
  @ApiOkResponse({ type: ReturnBrandDto })
  async getAll() {
    return await this.brandService.getAll();
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
  @MapResponseToDto(ReturnBrandDto)
  async create(@Body() createBrandDto: CreateBrandDto) {
    return await this.brandService.save(createBrandDto);
  }

  @Patch(':id')
  @Authentication()
  @MapResponseToDto(ReturnBrandDto)
  update(@Param('id') id: string, @Body() data: UpdateBrandDto) {
    return this.brandService.update(id, data);
  }

  @Post('activate/:id')
  @Authentication()
  @MapResponseToDto(ReturnBrandDto)
  activate(@Param('id') id: string) {
    return this.brandService.activate(id);
  }
}
