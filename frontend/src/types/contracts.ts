import type { ContractStatus } from './common';
import type { Property } from './properties'; 
import type { User } from './users';

export interface Contract {
  id: number;
  property_id: number;
  tenant_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: ContractStatus;
  created_at: string;
  updated_at: string;
  
}

export interface ContractFormData {
  property_id: number;
  tenant_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  terms: string;
  file?: File | null; // 👈 Agregado
}

export interface ContractWithRelations extends Contract {
  property: Property;
  tenant: User;
  bills_count: number;
}

export interface ContractStats {
  active_contracts: number;
  expiring_this_month: number;
  total_monthly_rent: number;
  occupancy_rate: number;
}