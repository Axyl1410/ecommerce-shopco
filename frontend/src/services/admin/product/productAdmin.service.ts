import {
  Product,
  ProductListResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  BulkActionResponse,
  ProductFilters,
  ProductStatus,
} from "@/types/admin/product.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

class ProductAdminServiceClass {
  /**
   * Get all products with pagination and filters
   */
  async getAllProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    if (filters.page !== undefined) params.append("page", filters.page.toString());
    if (filters.size !== undefined) params.append("size", filters.size.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortDir) params.append("sortDir", filters.sortDir);
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.status) params.append("status", filters.status);
    if (filters.brandId) params.append("brandId", filters.brandId);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);

    const response = await fetch(`${API_BASE_URL}/admin/products?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  }

  /**
   * Get single product by ID
   */
  async getProductById(id: string): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  }

  /**
   * Create new product
   */
  async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }

    return response.json();
  }

  /**
   * Update existing product
   */
  async updateProduct(id: string, data: UpdateProductRequest): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update product");
    }

    return response.json();
  }

  /**
   * Delete single product
   */
  async deleteProduct(id: string): Promise<BulkActionResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return response.json();
  }

  /**
   * Bulk delete products
   */
  async bulkDeleteProducts(ids: string[]): Promise<BulkActionResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/products/bulk-delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    });

    if (!response.ok) {
      throw new Error("Failed to delete products");
    }

    return response.json();
  }

  /**
   * Update product status
   */
  async updateProductStatus(id: string, status: ProductStatus): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}/status?status=${status}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update product status");
    }

    return response.json();
  }

  /**
   * Bulk update product status
   */
  async bulkUpdateStatus(ids: string[], status: ProductStatus): Promise<BulkActionResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/products/bulk-status?status=${status}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    });

    if (!response.ok) {
      throw new Error("Failed to update product statuses");
    }

    return response.json();
  }

  /**
   * Publish product
   */
  async publishProduct(id: string): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to publish product");
    }

    return response.json();
  }

  /**
   * Archive product
   */
  async archiveProduct(id: string): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to archive product");
    }

    return response.json();
  }
}

export const ProductAdminService = new ProductAdminServiceClass();
