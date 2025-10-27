import type {
    ProductFilters,
    ProductSort,
    PaginationParams,
    PaginatedProductsResponse,
} from "@/types/product.types";

/**
 * Product Service
 * Handles all product-related API calls
 */
class ProductService {
    private baseUrl = "/api/products";

    /**
     * Build query string from filters, sort, and pagination params
     */
    private buildQueryString(
        filters: ProductFilters,
        sort: ProductSort,
        pagination: PaginationParams
    ): string {
        const params = new URLSearchParams();

        // Pagination
        params.append("page", pagination.page.toString());
        params.append("limit", pagination.limit.toString());

        // Sorting
        params.append("sortBy", sort.sortBy);
        params.append("sortOrder", sort.sortOrder);

        // Filters
        if (filters.category) {
            params.append("category", filters.category);
        }

        if (filters.brandId) {
            params.append("brandId", filters.brandId);
        }

        if (filters.minPrice !== undefined) {
            params.append("minPrice", filters.minPrice.toString());
        }

        if (filters.maxPrice !== undefined) {
            params.append("maxPrice", filters.maxPrice.toString());
        }

        if (filters.colors && filters.colors.length > 0) {
            params.append("colors", filters.colors.join(","));
        }

        if (filters.sizes && filters.sizes.length > 0) {
            params.append("sizes", filters.sizes.join(","));
        }

        if (filters.tags && filters.tags.length > 0) {
            params.append("tags", filters.tags.join(","));
        }

        if (filters.search) {
            params.append("search", filters.search);
        }

        return params.toString();
    }

    /**
     * Fetch products with filters, sorting, and pagination
     */
    async getProducts(
        filters: ProductFilters,
        sort: ProductSort,
        pagination: PaginationParams
    ): Promise<PaginatedProductsResponse> {
        try {
            const queryString = this.buildQueryString(filters, sort, pagination);
            const url = `${this.baseUrl}?${queryString}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store", // Always fetch fresh data
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch products");
            }

            const data: PaginatedProductsResponse = await response.json();
            return data;
        } catch (error) {
            console.error("Error in ProductService.getProducts:", error);
            throw error;
        }
    }

    /**
     * Fetch a single product by slug
     */
    async getProductBySlug(slug: string) {
        try {
            const response = await fetch(`${this.baseUrl}/${slug}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch product");
            }

            return await response.json();
        } catch (error) {
            console.error("Error in ProductService.getProductBySlug:", error);
            throw error;
        }
    }

    /**
     * Get available filter options (categories, brands, etc.)
     */
    async getFilterOptions() {
        try {
            const response = await fetch(`${this.baseUrl}/filters`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch filter options");
            }

            return await response.json();
        } catch (error) {
            console.error("Error in ProductService.getFilterOptions:", error);
            throw error;
        }
    }
}

// Export singleton instance
export const productService = new ProductService();
