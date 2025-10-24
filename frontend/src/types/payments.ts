import type { Bill } from "./bills";

export interface Payment {
  id: number;
  bill_id: number;
  payment_date: string | null;
  amount: number;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentFormData {
  bill_id: number;
  payment_date: string;
  amount: number;
  payment_method: string;
  notes?: string;
  transaction_id?: string;
}

export interface PaymentWithRelations extends Payment {
  bill: Bill;
}

export interface PaymentStats {
  total_paid: number;
  pending_payments: number;
  overdue_payments: number;
  monthly_revenue: { month: string; revenue: number }[];
}
