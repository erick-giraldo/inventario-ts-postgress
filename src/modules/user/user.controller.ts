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
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
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
}
