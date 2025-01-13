import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Customer } from './customer.entity';


export const customerPaginateConfig: PaginateConfig<Customer> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    name: [FilterOperator.ILIKE],
    email: [FilterOperator.EQ, FilterOperator.ILIKE],
    documentType: [FilterOperator.EQ, FilterOperator.ILIKE],
    documentNumber: [FilterOperator.EQ, FilterOperator.ILIKE],
    status: [FilterOperator.EQ],
  },
};
