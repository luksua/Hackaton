// src/services/api.ts
import axios from "axios";
import type { Bill, BillFormData, BillWithRelations } from "../types/bills";
import type { Payment, PaymentFormData, PaymentWithRelations } from "../types/payments";
// import type { ApiResponse } from "../types/common";
import type { FeaturedProperty } from "../types/properties";
import type { ContractFormData, Contract, ContractWithRelations } from "../types/contracts";
import type { } from "../types/Images";
import type { Category } from "../types/categories";
import type { Sale, SaleWithRelations, SaleFormData } from "../types/sales";
import type { Property } from "../types/properties";


interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
}

// Base API URL
const API_URL = "http://127.0.0.1:8000/api"; // ⚠️ cámbialo por tu endpoint real (por ejemplo, import.meta.env.VITE_API_URL)

// ✅ Instancia de Axios configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Interceptor opcional (para token JWT)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🏠 Servicio de propiedades
export const propertyService = {
  /** Obtener propiedades destacadas */
  getFeaturedProperties: async (): Promise<FeaturedProperty[]> => {
    const res = await api.get<FeaturedProperty[]>("/properties/featured");
    return res.data;
  },

  /** Obtener propiedades por ID de propietario */
  getPropertiesByOwner: async (
    ownerId: number,
    page = 1
  ): Promise<PaginatedResponse<Property>> => {
    const res = await api.get<PaginatedResponse<Property>>(
      `/properties/owner/${ownerId}?page=${page}`
    );
    return res.data;
  },

getOwnerPropertiesList: async (ownerId: number): Promise<Property[]> => {
  const res = await api.get(`/properties/owner/${ownerId}`);
  return res.data.data; // 👈 devuelve solo el array
},

  /** Obtener una propiedad individual */
  getPropertyById: async (id: number): Promise<FeaturedProperty> => {
    const res = await api.get<FeaturedProperty>(`/properties/${id}`);
    return res.data;
  },

  /** Obtener todas las propiedades */

  getAllProperties: async (
    page = 1,
    filters: Record<string, string | number | null> = {}
  ): Promise<PaginatedResponse<FeaturedProperty>> => {
    const params = new URLSearchParams({ page: page.toString() });
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    const res = await api.get<PaginatedResponse<FeaturedProperty>>(`/properties?${params.toString()}`);
    return res.data;
  },

  /** Crear una nueva propiedad */
  async createProperty(formData: FormData) {
    const response = await axios.post("/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.property;
  },

  /** Eliminar una propiedad */
  deleteProperty: async (id: number): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};

// export const authService = {
//   checkToken: async () => {
//     try {
//       const res = await api.get("/check-token");
//       console.log("✅ Token válido:", res.data);
//     } catch (err: any) {
//       console.error("❌ Token inválido o expirado:", err.response?.status);
//     }
//   },
// };


// contratos
export const contractService = {
  createContract: async (data: ContractFormData): Promise<Contract> => {
    const res = await axios.post<Contract>(`${API_URL}/contracts`, data);
    return res.data;
  },

  getContractsByProperty: async (propertyId: number): Promise<ContractWithRelations[]> => {
    const res = await axios.get<ContractWithRelations[]>(`${API_URL}/contracts/property/${propertyId}`);
    return res.data;
  },

  updateContract: async (id: number, data: Partial<ContractFormData>): Promise<Contract> => {
    const res = await axios.put<Contract>(`${API_URL}/contracts/${id}`, data);
    return res.data;
  },
  getAll: async (): Promise<ContractWithRelations[]> => {
    const res = await axios.get<ContractWithRelations[]>(`${API_URL}/contracts`);
    return res.data;
  },
  
};

// imagenes de proiedad
export const propertyImageService = {
  uploadImages: async (data: {
    property_id: number;
    images: File[];
  }): Promise<void> => {
    const formData = new FormData();
    formData.append("property_id", data.property_id.toString());
    data.images.forEach((img) => formData.append("images[]", img));

    await api.post("/property-images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// categorías
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>("/categories");
    return res.data;
  },
};

// --------------------------------------------
// 💰 VENTAS
// --------------------------------------------
export const saleService = {
  getAll: async (): Promise<SaleWithRelations[]> => {
    const res = await api.get("/sales");
    return res.data;
  },

  getById: async (id: number): Promise<SaleWithRelations> => {
    const res = await api.get(`/sales/${id}`);
    return res.data;
  },

  create: async (data: SaleFormData): Promise<Sale> => {
    const res = await api.post("/sales", data);
    return res.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const res = await api.delete(`/sales/${id}`);
    return res.data;
  },
};

// --------------------------------------------
// 💳 FACTURACIÓN (BILLS + PAYMENTS)
// --------------------------------------------
export const billingService = {
  /** 📋 Obtener todas las cuentas de cobro */
  getAllBills: async (): Promise<BillWithRelations[]> => {
    const res = await api.get("/bills");
    return res.data;
  },

  /** 🧾 Crear una nueva cuenta de cobro */
  createBill: async (data: BillFormData): Promise<Bill> => {
    const res = await api.post("/bills", data);
    return res.data;
  },

  /** 💳 Registrar un pago */
  createPayment: async (data: PaymentFormData): Promise<Payment> => {
    const res = await api.post("/payments", data);
    return res.data;
  },

  /** 📜 Listar todos los pagos */
  getAllPayments: async (): Promise<PaymentWithRelations[]> => {
    const res = await api.get("/payments");
    return res.data;
  },

  /** 🔍 Obtener una cuenta de cobro específica con sus pagos */
  getBillById: async (id: number): Promise<BillWithRelations> => {
    const res = await api.get(`/bills/${id}`);
    return res.data;
  },
};

// --------------------------------------------
// 🔗 ENTIDADES POLIMÓRFICAS (para AddBillForm)
// --------------------------------------------
export const entityService = {
  /** 🔹 Listar contratos activos (para cuentas de cobro) */
  getContracts: async (): Promise<ContractWithRelations[]> => {
    const res = await api.get("/contracts");
    return res.data;
  },

  /** 🔹 Listar ventas (para cuentas de cobro) */
  getSales: async (): Promise<SaleWithRelations[]> => {
    const res = await api.get("/sales");
    return res.data;
  },
};

export default api;