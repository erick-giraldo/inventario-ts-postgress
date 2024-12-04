import { ObjectId } from "mongodb";
import { Client } from "../../../modules/client/client.entity"
import { IProduct } from "../../../modules/kardex/interface/kardex-reports.interface"
import { Supplier } from "../../../modules/supplier/supplier.entity"

export interface IMovement {
  id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  type: string
  product: string
  quantity: number
  previousStock: number
  newStock: number
  invoiceSeries: string
  invoiceNumber: string
  date: string
  supplierOrClient: Supplier | Client | null
  unitPrice: number
  netPrice: number
  igv: number
  description: string
  user: string
  }

  