package shopco.backend.application.dto.admin;

import java.util.List;

/**
 * Response DTO for paginated admin product list
 */
public class AdminProductListResponse {
    private List<AdminProductDto> products;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;

    public AdminProductListResponse() {
    }

    public AdminProductListResponse(List<AdminProductDto> products, long totalElements, 
            int totalPages, int currentPage, int pageSize) {
        this.products = products;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
    }

    public List<AdminProductDto> getProducts() {
        return products;
    }

    public void setProducts(List<AdminProductDto> products) {
        this.products = products;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
}
