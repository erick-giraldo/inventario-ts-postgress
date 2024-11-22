import { ObjectId } from 'mongodb';
import { Brand } from '../../../modules/brand/brand.entity';
import { Category } from '../../../modules/category/category.entity';

export interface IProduct {
  category: Category | null;
  brand: Brand | null;
  code: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  image: string;
  status?: boolean;
  id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface KardexEntry {
  date: string;
  detail: string;
  product: string;
  inputs: { provider: string; quantity: number } | null;
  outputs: { client: string; quantity: number } | null;
  balance: number;
}

export interface KardexReportData {
  Fecha: string;
  Detalle: string;
  Artículo: string;
  Proveedor: string;
  Entradas: number | string;
  Cliente: string;
  Salidas: number | string;
  Saldo: number | string;
  [key: string]: string | number;
}

export interface IReportData {
  report: KardexEntry[];
  summary: {
    finalBalance: number;
    periodStart: string;
    periodEnd: string;
    totalInputs: number;
    totalOutputs: number;
    product: string;
  };
}
