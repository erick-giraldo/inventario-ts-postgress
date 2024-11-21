import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';

import { ApiOkResponse } from '@nestjs/swagger';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';
import { Authentication } from '../authentication/decorators/authentication.decorator';
import { MovementService } from './movement.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { ReturnMovementDto } from './dto/return-movement.dto';
import { movementPaginateConfig } from './movement-config';

@Controller('movement')
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Authentication()
  @ApiOkPaginatedResponse(ReturnMovementDto, movementPaginateConfig)
  @ApiPaginationQuery(movementPaginateConfig)
  async getPaginated(@Paginate() query: PaginateQuery) {
    return await this.movementService.getPaginate(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Authentication()
  @ApiOkResponse({ type: ReturnMovementDto })
  async getById(@Param('id') id: string) {
    return await this.movementService.getById(id);
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
  @MapResponseToDto(ReturnMovementDto)
  async create(@Body() createProductDto: CreateMovementDto) {
    return await this.movementService.createMovement(createProductDto);
  }
}
