import { DeepPartial, Repository, ObjectLiteral } from "typeorm";

export type PaginateRepository<T extends ObjectLiteral> = Repository<T | { [K in keyof T]?: DeepPartial<T[K]> }>;