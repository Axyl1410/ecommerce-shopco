package app.application.use_cases;

import app.domain.repositories.ProductRepository;
import app.domain.repositories.PagedResult;
import app.domain.entities.Product;
import app.application.dto.ProductBrowseRequest;
import app.application.dto.FilterOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductBrowseUseCase {
    private final ProductRepository productRepository;

    public PagedResult<Product> execute(ProductBrowseRequest request) {
        var criteria = ProductSearchCriteria.builder()
                .page(request.getPage())
                .pageSize(request.getPageSize())
                .minPrice(request.getMinPrice())
                .maxPrice(request.getMaxPrice())
                .categoryIds(request.getCategoryIds())
                .brandIds(request.getBrandIds())
                .colors(request.getColors())
                .sizes(request.getSizes())
                .inStock(request.getInStock())
                .minRating(request.getMinRating())
                .hasPromotion(request.getHasPromotion())
                .sortBy(request.getSortBy())
                .sortDirection(request.getSortDirection())
                .build();

        return productRepository.search(criteria);
    }

    public FilterOptions getFilterOptions() {
        return FilterOptions.builder()
                .categories(getCategoriesWithCount())
                .brands(getBrandsWithCount())
                .colors(productRepository.getAvailableColors())
                .sizes(productRepository.getAvailableSizes())
                .priceRange(productRepository.getPriceRange())
                .build();
    }

    private List<CategoryOption> getCategoriesWithCount() {
        Map<String, Long> categoryCounts = productRepository.getProductCountByCategory();
        return categoryCounts.entrySet().stream()
                .map(entry -> new CategoryOption(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
}