export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: number;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
};

// ============= NEW TYPES FOR PRODUCT FILTERING & PAGINATION =============

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
};

export type Tag = {
  name: string;
  slug: string;
};

export type ProductVariant = {
  id: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  attributes?: Record<string, any>;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  imageAlt: string;
  category?: Category;
  brand?: Brand;
  tags: Tag[];
  inStock: boolean;
  variants: ProductVariant[];
};

export type ProductFilters = {
  category?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  search?: string;
};

export type SortOption = "price" | "rating" | "name" | "createdAt" | "popularity";
export type SortOrder = "asc" | "desc";

export type ProductSort = {
  sortBy: SortOption;
  sortOrder: SortOrder;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginatedProductsResponse = {
  products: ProductDetail[];
  pagination: PaginationMeta;
};
