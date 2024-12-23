import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { PaginateQuery } from 'nestjs-paginate';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { CategoryService } from '../category/category.service';
import { BrandService } from '../brand/brand.service';
import { validateObjectId } from '@/common/utils/validate';
import { Category } from '../category/category.entity';
import { Brand } from '../brand/brand.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { StorageService } from '../storage/storage.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly storageService: StorageService,
  ) {}

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
      validateObjectId(data.category);
      validateObjectId(data.brand);

      const category = await this.getCategory(data.category);
      this.checkCategoryStatus(category);

      const brand = await this.getBrand(data.brand);
      this.checkBrandStatus(brand);

      const image = await this.storageService.uploadImage(
              data.image as Express.Multer.File,
            )
    return this.productRepository.store({
      brand: data.brand,
      category: data.category,
      code: data.code,
      description: data.description,
      image: image.url,
      status: data.status !== undefined ? data.status : false,
      name: data.name,
      price: data.price,
      stock: 0,
    });
    } catch (e) {
      if (e.code === 11000) {
        const duplicateKeyMatch = e.message.match(/\{ (.+?) \}/);
        const duplicateKey = duplicateKeyMatch
          ? duplicateKeyMatch[1].replace(/["]/g, '')
          : 'unknown';
        throw new ConflictException({
          message: 'Product already exists',
          duplicateKey,
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
    const image =
      typeof data.image === 'string' || data.image === undefined
        ? found.image
        : (
            await this.storageService.uploadImage(
              data.image as Express.Multer.File,
            )
          ).url;

    return this.productRepository.updateProduct(id, {
      brand: data.brand || String(found.brand?.id),
      category: data.category || String(found.category?.id),
      code: data.code || found.code,
      description: data.description || found.description,
      image: image || found.image,
      status: data.status !== undefined ? data.status : found.status,
      name: data.name || found.name,
      price: data.price || found.price,
      stock: data.stock || found.stock,
    });
  }


  async getPaginate(query: PaginateQuery) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const sort =
      query.sortBy?.reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {}) || {};

    const paginated = await this.productRepository.findPaginated(
      page,
      limit,
      sort as Record<keyof Product, 'ASC' | 'DESC'>,
      query.filter as FindOptionsWhere<Product>,
    );

    return {
      results: paginated.items,
      meta: {
        itemsPerPage: limit,
        totalItems: paginated.count,
        currentPage: page,
        totalPages: Math.ceil(paginated.count / limit),
      },
    };
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
