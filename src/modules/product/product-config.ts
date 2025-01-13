import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Product } from './product.entity';


export const productPaginateConfig: PaginateConfig<Product> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    createdAt: [FilterOperator.EQ],
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    sku: [FilterOperator.ILIKE],
    stock: [FilterOperator.ILIKE],
    price: [FilterOperator.ILIKE],
    status: [FilterOperator.EQ],
    'category.id': [FilterOperator.EQ],
    'category.name': [FilterOperator.EQ, FilterOperator.ILIKE],
    'brand.id': [FilterOperator.EQ],
    'brand.name': [FilterOperator.EQ, FilterOperator.ILIKE],

  },
  relations: ['category', 'brand'],
};
