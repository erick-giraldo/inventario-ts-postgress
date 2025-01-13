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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { userPaginateConfig } from './user-paginate-config';
import { ReturnUserDto } from './dto/return-user.dto';
import { Authentication } from '../authentication/decorators/authentication.decorator';
import { SessionGuard } from '../authentication/guards/session.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { UserDecorator } from '../authentication/decorators/user.decorator';
import { EntityWithId } from '@/common/types/types';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkPaginatedResponse(ReturnUserDto, userPaginateConfig)
  @ApiPaginationQuery(userPaginateConfig)
  @Authentication()
  async getPaginated(@Paginate() query: PaginateQuery) {
    return await this.userService.findPaginated(query);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  @ApiBody({
    description: 'Datos para actualizar un usuario',
    schema: {
      type: 'object',
      properties: {
        emailAddress: {
          type: 'string',
          example: 'Juan Pérez',
        },
        username: {
          type: 'string',
          example: 'Juan Pérez',
        },
        fullName: {
          type: 'string',
          example: 'Juan Pérez',
        },
        role: {
          type: 'uuid',
          example: 'a1d2eb59-fe6e-45d2-8886-1406b1c30ae7',
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'success',
        },
        data: {
          type: 'boolean',
          example: 'true  ',
        },
      },
    },
  })
  @Authentication()
  async createUserByClientId(
    @UserDecorator() user: EntityWithId<User>,
    @Body() createUserDto: CreateUserDto,
  ) {
    return "success"
    // return await this.userService.createUser(createUserDto, user);
  }

}
