import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Category } from './category.entity';

export const categoryPaginateConfig: PaginateConfig<Category> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    status: [FilterOperator.EQ],
  },
};
