import type { User } from "./users";
import type { Category } from "./categories";
import type { PropertyImage } from "./Images";

// ventas
export type TransactionType = "rent" | "sale";
export type ListingStatus = "available" | "reserved" | "rented" | "sold" | "inactive";

/** 🏡 Propiedad base */
export interface Property {
  id: number;
  owner_id: number;
  category_id: number;
  address: string;
  city: string;
  area: number | null;
  price: number | null;
  description?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  is_featured: boolean;
  transaction_type: TransactionType;
  listing_status: ListingStatus;
  sale_type?: "normal" | "installment" | null;
  sold_at?: string | null;
  created_at: string;
  updated_at: string;

  // relaciones
  owner?: User;
  category?: Category;
  images?: PropertyImage[]; // 👈 AÑADE ESTO
}


/** ✍️ Formulario para crear/editar propiedad */
export interface PropertyForm {
  category_id: number;
  address: string;
  city: string;
  area: number | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  description: string;
  is_featured?: boolean;
  transaction_type: "rent" | "sale";
  // status?: "disponible" | "rentada" | "inactiva";
}

/** 📊 Propiedad con relaciones y estadísticas */
export interface PropertyWithRelations extends Property {
  owner: User;
  category: Category;
  contracts_count: number;
}

/** ⭐ Propiedades destacadas o mostradas en público */
export interface FeaturedProperty extends Property {
  bedrooms: number;
  bathrooms: number;
  features?: string[];
  is_featured: boolean;
  images: PropertyImage[]; // relación con la tabla property_images
}

/** 📈 Estadísticas agregadas */
export interface PropertyStats {
  total_count: number;
  average_price: number;
  average_area: number;
  cities: { city: string; count: number }[];
  categories: { category: string; count: number }[];
}
