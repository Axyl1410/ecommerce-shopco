package shopco.backend.application.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class ProductListRequest {

    @Min(value = 1, message = "Page must be greater than 0")
    @Max(value = 10000, message = "Page cannot exceed 10000")
    private int page;

    @Min(value = 1, message = "Limit must be greater than 0")
    @Max(value = 100, message = "Limit cannot exceed 100")
    private int limit;

    private String categoryId;
    private String brandId;
    private String status;

    /**
     * Creates a ProductListRequest with default pagination values.
     *
     * Initializes `page` to 1 and `limit` to 10.
     */
    public ProductListRequest() {
        this.page = 1;
        this.limit = 10;
    }

    /**
     * Constructs a ProductListRequest with the given pagination values and optional
     * filters.
     *
     * @param page       the page number (must be >= 1)
     * @param limit      the maximum number of items per page (must be >= 1)
     * @param categoryId optional category identifier to filter results
     * @param brandId    optional brand identifier to filter results
     * @param status     optional product status to filter results (e.g.,
     *                   "PUBLISHED", "DRAFT")
     */
    public ProductListRequest(int page, int limit, String categoryId, String brandId, String status) {
        this.page = page;
        this.limit = limit;
        this.categoryId = categoryId;
        this.brandId = brandId;
        this.status = status;
    }

    /**
     * The requested page number for paginated product listings.
     *
     * @return the requested page number; greater than or equal to 1
     */
    public int getPage() {
        return page;
    }

    /**
     * Set the requested page number for paginated product listings.
     *
     * @param page the page number to request; must be greater than or equal to 1
     */
    public void setPage(int page) {
        this.page = page;
    }

    /**
     * Retrieve the maximum number of items requested per page for pagination.
     *
     * @return the limit (number of items per page); must be greater than or equal
     *         to 1
     */
    public int getLimit() {
        return limit;
    }

    /**
     * Set the maximum number of items to return per page.
     *
     * @param limit the page size; must be greater than or equal to 1
     */
    public void setLimit(int limit) {
        this.limit = limit;
    }

    /**
     * Gets the category identifier used to filter the product list.
     *
     * @return the category identifier to filter products by, or {@code null} if
     *         unspecified
     */
    public String getCategoryId() {
        return categoryId;
    }

    /**
     * Sets the category identifier used to filter the product list.
     *
     * @param categoryId the category identifier to filter by
     */
    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    /**
     * Gets the brand identifier used to filter products.
     *
     * @return the brand identifier, or {@code null} if none is specified
     */
    public String getBrandId() {
        return brandId;
    }

    /**
     * Sets the brand identifier used to filter the product list.
     *
     * @param brandId the brand's identifier, or {@code null} to clear the brand
     *                filter
     */
    public void setBrandId(String brandId) {
        this.brandId = brandId;
    }

    /**
     * Retrieves the status filter used for listing products.
     *
     * @return the status string (e.g. `PUBLISHED`, `DRAFT`) or `null` if no status
     *         filter is set
     */
    public String getStatus() {
        return status;
    }

    /**
     * Sets the product list filter status.
     *
     * @param status the product status to filter by (e.g. "PUBLISHED", "DRAFT");
     *               may be null to clear the filter
     */
    public void setStatus(String status) {
        this.status = status;
    }
}