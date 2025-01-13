import { ObjectId } from 'mongodb';
import { Customer } from '../../customer/customer.entity';
import { Supplier } from '../../../modules/supplier/supplier.entity';

export interface IMovement {
  id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  type: string;
  product: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  invoiceSeries: string;
  invoiceNumber: string;
  date: string;
  supplierOrClient: Supplier | Customer | null;
  unitPrice: number;
  netPrice: number;
  igv: number;
  description: string;
  user: string;
}
