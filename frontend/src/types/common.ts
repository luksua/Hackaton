// Enums -> usar tipos literales (erasable-only)
export type UserRole = 'admin' | 'owner' | 'tenant';
export type ContractStatus = 'active' | 'expired' | 'finalized';
export type BillStatus = 'pending' | 'paid';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type BillStatus = "pending" | "paid";

// Responses de API genéricos
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Filtros y búsquedas  
export interface SearchFilters {
  query?: string;
  location?: string;
  property_type?: string;
  price_range?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
}

export interface PropertyFilters {
  category_id?: number;
  city?: string;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
}
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;