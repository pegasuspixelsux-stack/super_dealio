export type CarStatus = "available" | "reserved" | "sold";

export interface Car {
  id: string;
  make: string;
  model: string;
  bodyType: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel: string;
  color: string;
  description: string;
  status: CarStatus;
  featured: boolean;
  images: string[];
  imagePaths: string[];
  createdAt: number;
  soldAt: number | null;
}

export type LeadStatus = "new" | "contacted" | "converted";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  carId: string | null;
  carLabel: string;
  status: LeadStatus;
  createdAt: number;
}

export type UserRole = "admin" | "manager" | "operator" | "pending";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: number;
}

export interface DealershipSettings {
  name: string;
  currency: string;
  email: string;
  phone: string;
  address: string;
  notifyNewLead: boolean;
  notifyStatusChange: boolean;
  weeklyDigest: boolean;
}

export const DEFAULT_SETTINGS: DealershipSettings = {
  name: "SuperDealio",
  currency: "USD",
  email: "",
  phone: "",
  address: "",
  notifyNewLead: true,
  notifyStatusChange: false,
  weeklyDigest: true,
};
