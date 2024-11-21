import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Movement } from './movement.entity';



export const movementPaginateConfig: PaginateConfig<Movement> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    code: [FilterOperator.EQ, FilterOperator.ILIKE],
    index: [FilterOperator.EQ],
    status: [FilterOperator.EQ],
  },
};
