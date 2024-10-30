import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Product } from './product.entity';


export const productPaginateConfig: PaginateConfig<Product> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    code: [FilterOperator.EQ, FilterOperator.ILIKE],
    index: [FilterOperator.EQ],
    status: [FilterOperator.EQ],
  },
};
