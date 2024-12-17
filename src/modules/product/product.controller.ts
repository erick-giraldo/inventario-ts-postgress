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
  UseInterceptors,
  UploadedFile,
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
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';
import { Authentication } from '../authentication/decorators/authentication.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    // private readonly cloudinaryProvider: CloudinaryProvider,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
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
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //const uploadResult = await this.cloudinaryProvider.uploadImage(file);
    // console.log("🚀 ~ ProductController ~ uploadResult:", uploadResult)
    // const productData = {
    //   ...createProductDto,
    //   image: uploadResult.secure_url, // URL de la imagen subida
    // };
    return true;
    // return await this.productService.save(productData);
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
  @UseInterceptors(FileInterceptor('image', { storage }))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productService.update(id, { ...data, image });
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
