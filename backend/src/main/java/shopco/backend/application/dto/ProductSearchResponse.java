package shopco.backend.application.dto;

import java.util.List;

public class ProductSearchResponse {

    private List<ProductDto> products;
    private PaginationDto pagination;

    public ProductSearchResponse() {
    }

    public ProductSearchResponse(List<ProductDto> products, PaginationDto pagination) {
        this.products = products;
        this.pagination = pagination;
    }

    // Getters and Setters
    public List<ProductDto> getProducts() {
        return products;
    }

    public void setProducts(List<ProductDto> products) {
        this.products = products;
    }

    public PaginationDto getPagination() {
        return pagination;
    }

    public void setPagination(PaginationDto pagination) {
        this.pagination = pagination;
    }
}
