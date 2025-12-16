// Product Admin Types
export enum ProductStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED"
}

export interface ProductVariant {
  id?: string;
  sku?: string;
  attributes?: string; // JSON string
  price: number;
  salePrice?: number;
  stockQuantity: number;
  weight?: number;
  barcode?: string;
}

export interface ProductImage {
  id?: string;
  variantId?: string;
  url: string;
  altText?: string;
  sortOrder?: number;
}

export interface ProductTag {
  tagId: string;
  tagName: string;
  tagSlug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brandId: string;
  brandName?: string;
  categoryId: string;
  categoryName?: string;
  defaultImage?: string;
  images?: ProductImage[];
  seoMetaTitle?: string;
  seoMetaDesc?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
  tags?: ProductTag[];
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description?: string;
  brandId: string;
  categoryId: string;
  defaultImage?: string;
  seoMetaTitle?: string;
  seoMetaDesc?: string;
  status: ProductStatus;
  variants?: ProductVariant[];
  images?: ProductImage[];
  tagIds?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  description?: string;
  brandId?: string;
  categoryId?: string;
  defaultImage?: string;
  seoMetaTitle?: string;
  seoMetaDesc?: string;
  status?: ProductStatus;
  variants?: ProductVariant[];
  images?: ProductImage[];
  tagIds?: string[];
}

export interface ProductListResponse {
  products: Product[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product?: Product;
}

export interface BulkActionResponse {
  success: boolean;
  message: string;
}

export interface ProductFilters {
  keyword?: string;
  status?: ProductStatus;
  brandId?: string;
  categoryId?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
