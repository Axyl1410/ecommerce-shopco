export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type UpdateProfilePayload = {
  name?: string;
  avatarUrl?: string;
};

export type Address = {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string | null;
  isDefault?: boolean;
};

export type UpsertAddressPayload = Omit<Address, "id"> & { isDefault?: boolean };

export type OrderSummary = {
  id: string;
  code: string;
  createdAt: string | Date;
  total: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED" | "REFUNDED";
  itemsCount: number;
};

export type ReviewSummary = {
  id: string;
  productId: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  createdAt: string | Date;
};
