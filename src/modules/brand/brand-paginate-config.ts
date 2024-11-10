import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Brand } from './brand.entity';

export const brandPaginateConfig: PaginateConfig<Brand> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    status: [FilterOperator.EQ],
  },
};
