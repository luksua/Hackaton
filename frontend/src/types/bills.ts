import type { Contract } from "./contracts";
import type { Sale } from "./sales";
import type { Payment } from "./payments";

/** Estado de una cuenta de cobro */
export type BillStatus = "pending" | "paid";

/** Modelo base de la cuenta de cobro */
export interface Bill {
  id: number;
  billable_type: "App\\Models\\Contract" | "App\\Models\\Sale"; // relación polimórfica
  billable_id: number;
  due_date: string;
  amount: number;
  status: BillStatus;
  description?: string;
  created_at: string;
  updated_at: string;
}

/** Relación extendida */
export interface BillWithRelations extends Bill {
  billable?: Contract | Sale;
  payments?: Payment[];
}

/** Datos para crear una cuenta de cobro */
export interface BillFormData {
  billable_type: "App\\Models\\Contract" | "App\\Models\\Sale";
  billable_id: number;
  due_date: string;
  amount: number;
  description?: string;
}
