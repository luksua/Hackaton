import type { Property } from "./properties";
import type { User } from "./users";
import type { Bill } from "./bills";

export type SaleType = "normal" | "installment";

export interface Sale {
  id: number;
  property_id: number;
  tenant_id: number;
  total_amount: number;
  sale_type: SaleType;
  installments?: number | null;
  installment_amount?: number | null;
  sale_date: string;
  created_at: string;
  updated_at: string;
}

export interface SaleWithRelations extends Sale {
  property: Property;
  tenant: User;
  bills?: Bill[];
}

export interface SaleFormData {
  property_id: number;
  tenant_id: number;
  total_amount: number;
  sale_type: SaleType;
  installments?: number;
  installment_amount?: number;
  sale_date: string;
}
