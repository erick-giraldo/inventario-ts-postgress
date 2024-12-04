import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Product } from './product.entity';


export const productPaginateConfig: PaginateConfig<Product> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    name: [FilterOperator.ILIKE],
    code: [FilterOperator.ILIKE],
    stock: [FilterOperator.ILIKE],
    price: [FilterOperator.ILIKE],
    status: [FilterOperator.EQ],
  },
};
