/**
 * Search Service
 * Handles product search API calls to backend
 */
class SearchService {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

    /**
     * Search products by query
     */
    async searchProducts(
        query: string,
        page: number = 1,
        limit: number = 10,
        categoryId?: string,
        brandId?: string
    ) {
        try {
            const params = new URLSearchParams({
                query,
                page: page.toString(),
                limit: limit.toString(),
            });

            if (categoryId) {
                params.append("categoryId", categoryId);
            }

            if (brandId) {
                params.append("brandId", brandId);
            }

            const url = `${this.baseUrl}/products/search?${params.toString()}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to search products");
            }

            const data = await response.json();

            if (data.result === "SUCCESS") {
                return data.data;
            }

            throw new Error(data.message || "Search failed");
        } catch (error) {
            console.error("Error in SearchService.searchProducts:", error);
            throw error;
        }
    }
}

// Export singleton instance
export const searchService = new SearchService();
