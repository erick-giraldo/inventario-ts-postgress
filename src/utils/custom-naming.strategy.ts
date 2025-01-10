import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { NamingStrategyInterface, Table } from 'typeorm';

export class CustomNamingStrategy extends SnakeNamingStrategy implements NamingStrategyInterface {
  override foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ) {
    const tableName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name || `_${referencedColumnNames?.join('_')}_`;
    const reduce =
      columnNames.reduce((name, column) => {
        return `${name}_${column}`;
      }, tableName) || referencedTablePath;

    return `fk_${reduce}`.substring(0, 63).trim();
  }

  override uniqueConstraintName(tableOrName: Table | string, columnNames: string[]) {
    const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const reduce = columnNames.reduce((name, column) => {
      return `${name}_${column}`;
    }, tableName);

    return `uq_${reduce}`.substring(0, 63).trim();
  }
}
