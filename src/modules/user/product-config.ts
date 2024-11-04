import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { User } from './user.entity';

export const userPaginateConfig: PaginateConfig<User> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    code: [FilterOperator.EQ, FilterOperator.ILIKE],
    index: [FilterOperator.EQ],
    status: [FilterOperator.EQ],
  },
};
