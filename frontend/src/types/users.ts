import type { UserRole } from './common';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  password: string;
  remember_token?: string | null;
  created_at: string;
  updated_at: string;
  role: UserRole;
  phone?: string | null;
}

export interface UserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  avatar?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergency_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile extends User {
  profile?: UserProfile;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  users_by_role: { role: string; count: number }[];
  new_users_this_month: number;
}

export type { UserRole };
