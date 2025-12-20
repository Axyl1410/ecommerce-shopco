package shopco.backend.application.use_cases;

import org.springframework.stereotype.Component;
import shopco.backend.application.dto.ProductDetailsDto;
import shopco.backend.application.dto.ProductVariantDto;
import shopco.backend.application.dto.ProductImageDto;
import shopco.backend.application.dto.ReviewDto;
import shopco.backend.domain.entities.ProductEntity;
import shopco.backend.domain.enums.ProductStatus;
import shopco.backend.domain.repositories.IProductRepositoryDetails;
import shopco.backend.infrastructure.repository.ProductVariantRepository;
import shopco.backend.infrastructure.repository.ProductImageRepository;
import shopco.backend.infrastructure.repository.ReviewRepository;
import shopco.backend.infrastructure.repository.ProductTagRepository;
import shopco.backend.infrastructure.repository.BrandRepository;
import shopco.backend.infrastructure.repository.CategoryRepository;
import shopco.backend.infrastructure.repository.TagRepository;
import shopco.backend.infrastructure.model.ProductVariant;
import shopco.backend.infrastructure.model.ProductImage;
import shopco.backend.infrastructure.model.Review;
import shopco.backend.infrastructure.model.ProductTag;
import shopco.backend.infrastructure.model.Brand;
import shopco.backend.infrastructure.model.Category;
import shopco.backend.infrastructure.model.Tag;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class GetProductDetailsUseCase {

    private final IProductRepositoryDetails productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewRepository reviewRepository;
    private final ProductTagRepository productTagRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public GetProductDetailsUseCase(
            IProductRepositoryDetails productRepository,
            ProductVariantRepository productVariantRepository,
            ProductImageRepository productImageRepository,
            ReviewRepository reviewRepository,
            ProductTagRepository productTagRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            TagRepository tagRepository) {
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productImageRepository = productImageRepository;
        this.reviewRepository = reviewRepository;
        this.productTagRepository = productTagRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    public Optional<ProductDetailsDto> execute(String productId) {
        // 2. Validate productId
        if (productId == null || productId.trim().isEmpty()) {
            throw new IllegalArgumentException("Product ID cannot be null or empty");
        }

        // 3. Check if product exists and is active
        Optional<ProductEntity> productOpt = productRepository.findProductById(productId);
        if (productOpt.isEmpty()) {
            return Optional.empty(); // Product not found
        }

        ProductEntity product = productOpt.get();

        // Check if product is active
        if (product.getStatus() != ProductStatus.PUBLISHED) {
            return Optional.empty(); // Product not active
        }

        // 3.2 Query product details
        // Fetch related data
        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
        List<ProductImage> images = productImageRepository.findByProductId(productId);
        List<Review> reviews = reviewRepository.findByProductId(productId);
        List<ProductTag> productTags = productTagRepository.findByProductId(productId);

        // Fetch brand and category names
        String brandName = null;
        if (product.getBrandId() != null) {
            Optional<Brand> brandOpt = brandRepository.findById(product.getBrandId());
            brandName = brandOpt.map(Brand::getName).orElse(null);
        }

        String categoryName = null;
        if (product.getCategoryId() != null) {
            Optional<Category> categoryOpt = categoryRepository.findById(product.getCategoryId());
            categoryName = categoryOpt.map(Category::getName).orElse(null);
        }

        // Fetch tag names
        List<String> tagNames = productTags.stream()
                .map(pt -> {
                    Optional<Tag> tagOpt = tagRepository.findById(pt.getTagId());
                    return tagOpt.map(Tag::getName).orElse(null);
                })
                .filter(name -> name != null)
                .collect(Collectors.toList());

        // Calculate price range
        BigDecimal minPrice = variants.stream()
                .map(v -> v.getSalePrice() != null ? v.getSalePrice() : v.getPrice())
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        BigDecimal maxPrice = variants.stream()
                .map(v -> v.getSalePrice() != null ? v.getSalePrice() : v.getPrice())
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        // 3.3 Check stock status
        StockStatus stockStatus = calculateStockStatus(variants);

        // Convert to DTOs
        List<ProductVariantDto> variantDtos = variants.stream()
                .map(this::convertToVariantDto)
                .collect(Collectors.toList());

        List<ProductImageDto> imageDtos = images.stream()
                .map(this::convertToImageDto)
                .collect(Collectors.toList());

        List<ReviewDto> reviewDtos = reviews.stream()
                .map(this::convertToReviewDto)
                .collect(Collectors.toList());

        ProductDetailsDto dto = new ProductDetailsDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setBrandId(product.getBrandId());
        dto.setBrandName(brandName);
        dto.setCategoryId(product.getCategoryId());
        dto.setCategoryName(categoryName);
        dto.setDefaultImage(product.getDefaultImage());
        dto.setSeoMetaTitle(product.getSeoMetaTitle());
        dto.setSeoMetaDesc(product.getSeoMetaDesc());
        dto.setStatus(product.getStatus().toString());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        dto.setVariants(variantDtos);
        dto.setImages(imageDtos);
        dto.setReviews(reviewDtos);
        dto.setTags(tagNames);
        dto.setMinPrice(minPrice);
        dto.setMaxPrice(maxPrice);
        dto.setStockStatus(stockStatus.toString());

        return Optional.of(dto);
    }

    /**
     * Calculate overall stock status based on variants
     */
    private StockStatus calculateStockStatus(List<ProductVariant> variants) {
        if (variants.isEmpty()) {
            return StockStatus.OUT_OF_STOCK;
        }

        int totalStock = variants.stream()
                .mapToInt(ProductVariant::getStockQuantity)
                .sum();

        if (totalStock == 0) {
            return StockStatus.OUT_OF_STOCK;
        } else if (totalStock <= 10) { // Assuming low stock threshold is 10
            return StockStatus.LOW_STOCK;
        } else {
            return StockStatus.IN_STOCK;
        }
    }

    public enum StockStatus {
        IN_STOCK("in_stock"),    // xanh
        LOW_STOCK("low_stock"),  // vàng
        OUT_OF_STOCK("out_of_stock"); // đỏ

        private final String value;

        StockStatus(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return value;
        }
    }

    private ProductVariantDto convertToVariantDto(ProductVariant variant) {
        return new ProductVariantDto(
                variant.getId(),
                variant.getSku(),
                variant.getAttributes(),
                variant.getPrice(),
                variant.getSalePrice(),
                variant.getStockQuantity(),
                variant.getWeight(),
                variant.getBarcode()
        );
    }

    private ProductImageDto convertToImageDto(ProductImage image) {
        return new ProductImageDto(
                image.getId(),
                image.getVariantId(),
                image.getUrl(),
                image.getAltText(),
                image.getSortOrder()
        );
    }

    private ReviewDto convertToReviewDto(Review review) {
        return new ReviewDto(
                review.getId(),
                review.getProductId(),
                review.getRating(),
                review.getTitle(),
                review.getBody(),
                review.getCreatedAt()
        );
    }
}