import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Supplier } from './supplier.entity';


export const supplierPaginateConfig: PaginateConfig<Supplier> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    status: [FilterOperator.EQ],
  },
};
