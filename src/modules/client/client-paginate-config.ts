import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Client } from './client.entity';


export const clientPaginateConfig: PaginateConfig<Client> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    status: [FilterOperator.EQ],
  },
};
