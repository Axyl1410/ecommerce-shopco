package shopco.backend.application.use_cases;

import org.springframework.stereotype.Component;
import shopco.backend.application.dto.ProductSearchRequest;
import shopco.backend.application.dto.ProductSearchResponse;
import shopco.backend.application.dto.ProductDto;
import shopco.backend.application.dto.PaginationDto;
import shopco.backend.domain.entities.ProductEntity;
import shopco.backend.domain.repositories.IProductRepository;
import shopco.backend.infrastructure.repository.ProductVariantRepository;
import shopco.backend.infrastructure.repository.ProductTagRepository;
import shopco.backend.infrastructure.repository.BrandRepository;
import shopco.backend.infrastructure.repository.CategoryRepository;
import shopco.backend.infrastructure.repository.TagRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SearchProductsUseCase {

    private final IProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductTagRepository productTagRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public SearchProductsUseCase(
            IProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            ProductTagRepository productTagRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            TagRepository tagRepository) {
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productTagRepository = productTagRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    public ProductSearchResponse execute(ProductSearchRequest request) {
        // Validate query
        if (request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            throw new IllegalArgumentException("Search query cannot be empty");
        }

        // Search products
        List<ProductEntity> productEntities = productRepository.searchProducts(
                request.getQuery().trim(),
                request.getCategoryId(),
                request.getBrandId(),
                request.getPage(),
                request.getLimit());

        // Count total results
        long totalCount = productRepository.countSearchResults(
                request.getQuery().trim(),
                request.getCategoryId(),
                request.getBrandId());

        // Convert to DTOs
        List<ProductDto> productDtos = productEntities.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        // Build pagination info
        PaginationDto pagination = new PaginationDto(
                request.getPage(),
                request.getLimit(),
                totalCount);

        return new ProductSearchResponse(productDtos, pagination);
    }

    private ProductDto convertToDto(ProductEntity entity) {
        ProductDto dto = new ProductDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setSlug(entity.getSlug());
        dto.setDescription(entity.getDescription());
        dto.setDefaultImage(entity.getDefaultImage());
        dto.setCategoryId(entity.getCategoryId());
        dto.setBrandId(entity.getBrandId());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().toString() : null);

        // Get category name
        if (entity.getCategoryId() != null) {
            categoryRepository.findById(entity.getCategoryId()).ifPresent(category -> {
                dto.setCategoryName(category.getName());
            });
        }

        // Get brand name
        if (entity.getBrandId() != null) {
            brandRepository.findById(entity.getBrandId()).ifPresent(brand -> {
                dto.setBrandName(brand.getName());
            });
        }

        // Get variant price range
        var variants = productVariantRepository.findByProductId(entity.getId());
        if (!variants.isEmpty()) {
            // minPrice = lowest sale price (or price if no sale)
            BigDecimal minPrice = variants.stream()
                    .map(v -> v.getSalePrice() != null ? v.getSalePrice() : v.getPrice())
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            // maxPrice = highest original price (not sale price)
            BigDecimal maxPrice = variants.stream()
                    .map(v -> v.getPrice())
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            dto.setMinPrice(minPrice);
            dto.setMaxPrice(maxPrice);
            dto.setTotalVariants(variants.size());
        } else {
            dto.setMinPrice(BigDecimal.ZERO);
            dto.setMaxPrice(BigDecimal.ZERO);
            dto.setTotalVariants(0);
        }

        // Get tags
        var productTags = productTagRepository.findByProductId(entity.getId());
        List<String> tagNames = productTags.stream()
                .map(pt -> {
                    return tagRepository.findById(pt.getTagId())
                            .map(tag -> tag.getName())
                            .orElse("");
                })
                .filter(name -> !name.isEmpty())
                .collect(Collectors.toList());
        dto.setTags(tagNames);

        return dto;
    }
}
