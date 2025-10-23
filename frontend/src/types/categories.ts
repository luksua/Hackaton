export interface Category {
  id: number;
  name: string;
  slug: string;          
  description: string | null; 
  created_at: string;
  updated_at: string;
}

export interface CategoryWithCount extends Category {
  properties_count: number;
}