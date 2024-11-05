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
import { userPaginateConfig } from './product-config';
import { ReturnUserDto } from './dto/return-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  // @UseGuards(SessionGuard)
  @ApiOkPaginatedResponse(ReturnUserDto, userPaginateConfig)
  @ApiPaginationQuery(userPaginateConfig)
  // @Authentication()
  async getPaginated(@Paginate() query: PaginateQuery) {
    return await this.userService.getPaginate(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(SessionGuard)
  // // @ApiOkPaginatedResponse(ReturnProductDto, productPaginateConfig)
  // @ApiPaginationQuery(productPaginateConfig)
  // @Authentication()
  async getById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Get('user-name/:username')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(SessionGuard)
  // // @ApiOkPaginatedResponse(ReturnProductDto, productPaginateConfig)
  // @ApiPaginationQuery(productPaginateConfig)
  // @Authentication()
  async getByUserName(@Param('username') username: string) {
    return await this.userService.getByUsernameOrEmailAddress(username);
  }
}
