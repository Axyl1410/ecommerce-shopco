import type { ApiSuccessResponse } from "@/types/api";

export type CartItem = {
  id: string;
  cartId: string;
  variantId: string;
  productName: string;
  imageUrl: string | null;
  sku: string;
  /** JSON-stringified attributes, e.g. '{"size":"16-inch"}' */
  attributes: string;
  quantity: number;
  priceAtAdd: number;
  subtotal: number;
  createdAt: string; // ISO 8601
};

export type Cart = {
  id: string;
  userId: string;
  sessionId: string | null;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

export type GetCartResponse = ApiSuccessResponse<Cart>;
