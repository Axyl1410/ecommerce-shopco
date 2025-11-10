package shopco.backend.application.dto;

import jakarta.validation.constraints.Min;

public class ProductListRequest {

    @Min(value = 1, message = "Page must be greater than 0")
    private int page;

    @Min(value = 1, message = "Limit must be greater than 0")
    private int limit;

    private String categoryId;
    private String brandId;
    private String status; // PUBLISHED, DRAFT, etc.

    public ProductListRequest() {
        this.page = 1;
        this.limit = 10;
    }

    public ProductListRequest(int page, int limit, String categoryId, String brandId, String status) {
        this.page = page;
        this.limit = limit;
        this.categoryId = categoryId;
        this.brandId = brandId;
        this.status = status;
    }

    // Getters and Setters
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
