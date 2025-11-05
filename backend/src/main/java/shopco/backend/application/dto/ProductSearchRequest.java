package shopco.backend.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ProductSearchRequest {

    @NotNull(message = "Search query is required")
    private String query;

    @Min(value = 1, message = "Page must be at least 1")
    private int page = 1;

    @Min(value = 1, message = "Limit must be at least 1")
    private int limit = 10;

    private String categoryId;
    private String brandId;

    public ProductSearchRequest() {
    }

    public ProductSearchRequest(String query, int page, int limit, String categoryId, String brandId) {
        this.query = query;
        this.page = page;
        this.limit = limit;
        this.categoryId = categoryId;
        this.brandId = brandId;
    }

    // Getters and Setters
    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getBrandId() {
        return brandId;
    }

    public void setBrandId(String brandId) {
        this.brandId = brandId;
    }
}
