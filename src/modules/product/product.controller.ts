// src/producto/producto.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Product } from './product.entity';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ProductService } from './product.service';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService ) {}

  @Post()
  crearProducto(@Body() data: Product){
    return this.productService.create(data);
  }

  @Get()
//   @ApiPaginationQuery(derivationsPaginateConfig)
  async getPaginated(
    @Paginate() query: PaginateQuery,
  ) {
    return await this.productService.getPaginate(query);
  }


  @Put(':id')
  actualizarProducto(
    @Param('id') id: string,
    @Body() data: Partial<Product>,
  ) {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  eliminarProducto(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
