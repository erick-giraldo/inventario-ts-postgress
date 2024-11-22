import { AbstractEntity } from '@/common/entities/abstract.entity';
import { InvoiceType } from '@/common/enums/invoice-type.enum copy';
import { Entity, Column } from 'typeorm';

@Entity()
export class Movement extends AbstractEntity {
  @Column()
  readonly type: 'IN' | 'OUT';

  @Column()
  readonly product: string;

  @Column()
  readonly quantity: number;

  @Column()
  readonly previousStock: number;

  @Column()
  readonly newStock: number;

  @Column({
    type: 'enum',
    enum: InvoiceType,
  })
  readonly documenttype: InvoiceType;

  @Column()
  readonly invoiceSeries: string;

  @Column()
  readonly invoiceNumber: string;

  @Column()
  readonly date: string;

  @Column()
  readonly supplierOrClient: string;

  @Column()
  readonly unitPrice: number;

  @Column()
  readonly netPrice: number;

  @Column()
  readonly igv: number;

  @Column()
  readonly description: string;

  @Column()
  readonly user: string;
}
