export interface PropertyImage {
  id: number;
  property_id: number;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyImageForm {
  property_id: number;
  images: File[]; 
}