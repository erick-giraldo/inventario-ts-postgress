import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { CategoryService } from '../category/category.service';
import { BrandService } from '../brand/brand.service';
import { Category } from '../category/category.entity';
import { Brand } from '../brand/brand.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { StorageService } from '../storage/storage.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PG_UNIQUE_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { productPaginateConfig } from './product-config';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly storageService: StorageService,
  ) {}

  async findPaginated(query: PaginateQuery) {
    return paginate(query, this.productRepository, productPaginateConfig);
  }

  private checkCategoryStatus(category: Category): void {
    if (!category.status) {
      throw new ConflictException({ message: 'Category is not active' });
    }
  }

  private checkBrandStatus(brand: Brand): void {
    if (!brand.status) {
      throw new ConflictException({ message: 'Brand is not active' });
    }
  }

  private async getCategory(category: string) {
    const found = await this.categoryService.findById(category);
    if (!found) {
      throw new ConflictException({ message: 'Category does not exist' });
    }
    return found;
  }

  private async getBrand(brand: string) {
    const found = await this.brandService.findById(brand);
    if (!found) {
      throw new ConflictException({ message: 'Brand does not exist' });
    }
    return found;
  }

  async save(data: CreateProductDto) {
    try {
      const category = await this.getCategory(data.category);
      this.checkCategoryStatus(category);

      const brand = await this.getBrand(data.brand);
      this.checkBrandStatus(brand);

      const image = await this.storageService.uploadImage(
        data.image as Express.Multer.File,
      );

      const product = await this.productRepository.store({
        brand,
        category,
        sku: data.code,
        description: data.description,
        image: image.url,
        status: data.status !== undefined ? data.status : false,
        name: data.name,
        price: data.price,
        stock: 0,
      });

      return product;
    } catch (e) {
      if (e.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException({
          message: 'Product already exists',
        });
      }
      throw e;
    }
  }

  async update(id: string, data: UpdateProductDto) {
    const found = await this.getById(id);
    if (!found) {
      throw new ConflictException({ message: 'Product does not exist' });
    }
    const category = data.category
      ? await this.getCategory(data.category)
      : found.category;

    const brand = data.brand ? await this.getBrand(data.brand) : found.brand;

    const image =
      typeof data.image === 'string' || data.image === undefined
        ? found.image
        : (
            await this.storageService.uploadImage(
              data.image as Express.Multer.File,
            )
          ).url;

    return this.productRepository.updateProduct(id, {
      brand: brand,
      category: category,
      sku: data.code || found.sku,
      description: data.description || found.description,
      image: image || found.image,
      status: data.status !== undefined ? data.status : found.status,
      name: data.name || found.name,
      price: data.price || found.price,
      stock: data.stock || found.stock,
    });
  }

  
  async getById(id: string) {
    const found = await this.productRepository.getById(id);
    if (!found) {
      throw new ConflictException({ message: 'Product does not exist' });
    }
    return found;
  }

  async activate(id: string) {
    const found = await this.getById(id);
    if (!found) {
      throw new ConflictException({ message: 'Product does not exist' });
    }
    const newStatus = !found.status;
    return this.productRepository.activate(id, newStatus);
  }

  async delete(id: string) {
    return this.productRepository.delete(id);
  }
}
