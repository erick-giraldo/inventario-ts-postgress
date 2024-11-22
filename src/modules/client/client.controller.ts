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

import { ClientService } from './client.service';
import { ReturnClientDto } from './dto/return-client.dto';
import { clientPaginateConfig } from './client-paginate-config';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-supplier.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkPaginatedResponse(ReturnClientDto, clientPaginateConfig)
  @ApiPaginationQuery(clientPaginateConfig)
  @Authentication()
  async getPaginated(@Paginate() query: PaginateQuery) {
    return await this.clientService.getPaginate(query);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Authentication()
  @MapResponseToDto(ReturnClientDto)
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientService.save(createClientDto);
  }

  @Patch(':id')
  @Authentication()
  @MapResponseToDto(ReturnClientDto)
  update(@Param('id') id: string, @Body() data: UpdateClientDto) {
    return this.clientService.update(id, data);
  }

  @Post('activate/:id')
  @Authentication()
  @MapResponseToDto(ReturnClientDto)
  activate(@Param('id') id: string) {
    return this.clientService.activate(id);
  }
}
