import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Client } from './client.entity';


export const clientPaginateConfig: PaginateConfig<Client> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    names: [FilterOperator.ILIKE],
    email: [FilterOperator.EQ, FilterOperator.ILIKE],
    documentType: [FilterOperator.EQ, FilterOperator.ILIKE],
    documentNumber: [FilterOperator.EQ, FilterOperator.ILIKE],
    status: [FilterOperator.EQ],
  },
};
