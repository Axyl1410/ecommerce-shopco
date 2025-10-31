package app.domain.repositories;

import app.domain.entities.Product;
import app.domain.value_objects.Money;

import java.util.List;
import java.util.Map;

public interface ProductRepository {
    PagedResult<Product> search(ProductSearchCriteria criteria);
    Map<String, Long> getProductCountByCategory();
    List<String> getAvailableColors();
    List<String> getAvailableSizes();
    Pair<Money, Money> getPriceRange();
}

@Value
public class ProductSearchCriteria {
    int page;
    int pageSize;
    Money minPrice;
    Money maxPrice;
    List<String> categoryIds;
    List<String> brandIds;
    List<String> colors;
    List<String> sizes;
    Boolean inStock;
    Double minRating;
    Boolean hasPromotion;
    String sortBy;
    String sortDirection;

    @Builder
    public ProductSearchCriteria(
            int page,
            int pageSize,
            Money minPrice,
            Money maxPrice,
            List<String> categoryIds,
            List<String> brandIds,
            List<String> colors,
            List<String> sizes,
            Boolean inStock,
            Double minRating,
            Boolean hasPromotion,
            String sortBy,
            String sortDirection) {
        this.page = page;
        this.pageSize = pageSize;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.categoryIds = categoryIds;
        this.brandIds = brandIds;
        this.colors = colors;
        this.sizes = sizes;
        this.inStock = inStock;
        this.minRating = minRating;
        this.hasPromotion = hasPromotion;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
    }
}

@Value
public class PagedResult<T> {
    List<T> items;
    int page;
    int pageSize;
    long totalItems;
    int totalPages;
}