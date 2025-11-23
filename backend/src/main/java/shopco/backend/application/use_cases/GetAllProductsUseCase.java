package shopco.backend.application.use_cases;

import org.springframework.stereotype.Component;
import shopco.backend.application.dto.ProductListRequest;
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
public class GetAllProductsUseCase {

    private final IProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductTagRepository productTagRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    /**
     * Create a GetAllProductsUseCase wired with the required repository dependencies.
     */
    public GetAllProductsUseCase(
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

    /**
     * Retrieves products matching the provided filters and returns them with pagination metadata.
     *
     * <p>Filters and pagination values are taken from the given request: categoryId, brandId, status,
     * page, and limit. Each returned product is converted to a ProductDto containing resolved brand,
     * category, price range, variants count, and tags.</p>
     *
     * @param request container of filter and pagination parameters (categoryId, brandId, status, page, limit)
     * @return a ProductSearchResponse containing the list of matching ProductDto objects and pagination info
     */
    public ProductSearchResponse execute(ProductListRequest request) {
        // Get all products with filters
        List<ProductEntity> productEntities = productRepository.findAllProducts(
                request.getCategoryId(),
                request.getBrandId(),
                request.getStatus(),
                request.getPage(),
                request.getLimit());

        // Count total results
        long totalCount = productRepository.countAllProducts(
                request.getCategoryId(),
                request.getBrandId(),
                request.getStatus());

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

    /**
     * Convert a ProductEntity into a ProductDto populated with core fields, resolved category and brand names,
     * variant price range and count, and tag names.
     *
     * @param entity the product entity to convert
     * @return a ProductDto containing id, name, slug, description, default image, categoryId, brandId, status,
     *         categoryName and brandName (if available), minPrice and maxPrice (derived from variants, or zero if none),
     *         totalVariants, and a list of tag names (empty if none)
     */
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