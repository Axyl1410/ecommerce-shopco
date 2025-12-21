package shopco.backend.application.use_cases;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import shopco.backend.application.dto.ProductDetailsDto;
import shopco.backend.domain.entities.ProductEntity;
import shopco.backend.domain.enums.ProductStatus;
import shopco.backend.domain.repositories.IProductRepositoryDetails;
import shopco.backend.infrastructure.repository.*;
import shopco.backend.infrastructure.model.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetProductDetailsUseCaseTest {

    //kiểm tra dữ liệu chi tiết sản phẩm trả về từ use case có đúng không
    //lấy các data giả
    @Mock
    private IProductRepositoryDetails productRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private ProductTagRepository productTagRepository;

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private GetProductDetailsUseCase useCase;

    private ProductEntity productEntity;
    private ProductVariant variant;
    private ProductImage image;
    private Review review;
    private ProductTag productTag;
    private Brand brand;
    private Category category;
    private Tag tag;

    //chuẩn bị dữ liệu trước mỗi test
    @BeforeEach
    void setUp() {
        // Setup test data
        productEntity = new ProductEntity(
            "prod-123",
            "Test Product",
            "test-product",
            "Test description",
            "brand-123",
            null,
            "cat-123",
            null,
            "default.jpg",
            "SEO Title",
            "SEO Desc",
            ProductStatus.PUBLISHED,
            LocalDateTime.now(),
            LocalDateTime.now(),
            null, null, null, null, null, null, null
        );

        variant = new ProductVariant();
        variant.setId("var-123");
        variant.setProductId("prod-123");
        variant.setPrice(BigDecimal.valueOf(100.00));
        variant.setStockQuantity(50);

        image = new ProductImage();
        image.setId("img-123");
        image.setProductId("prod-123");
        image.setUrl("image.jpg");

        review = new Review();
        review.setId("rev-123");
        review.setProductId("prod-123");
        review.setRating(5);
        review.setTitle("Great product");

        productTag = new ProductTag();
        productTag.setProductId("prod-123");
        productTag.setTagId("tag-123");

        brand = new Brand();
        brand.setId("brand-123");
        brand.setName("Test Brand");

        category = new Category();
        category.setId("cat-123");
        category.setName("Test Category");

        tag = new Tag();
        tag.setId("tag-123");
        tag.setName("Test Tag");
    }

    //kiểm tra productId =  null - trả về ngoại lệ - không truy vấn cơ sở dữ liệu
    @Test
    void shouldThrowExceptionWhenProductIdIsNull() {
        assertThatThrownBy(() -> useCase.execute(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Product ID cannot be null or empty");
    }

    //kiểm tra productId = "" - trả về ngoại lệ - dừng luồng xử lý
    @Test
    void shouldThrowExceptionWhenProductIdIsEmpty() {
        assertThatThrownBy(() -> useCase.execute(""))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Product ID cannot be null or empty");
    }

    //kiểm tra khi không tìm thấy sản phẩm - trả về Optional.empty() - 404 Not Found
    @Test
    void shouldReturnEmptyWhenProductNotFound() {
        when(productRepository.findProductById("non-existent")).thenReturn(Optional.empty());

        Optional result = useCase.execute("non-existent");

        assertThat(result).isEmpty();
    }

    //kiểm tra khi sản phẩm không ở trạng thái active - trả về Optional.empty() - 404 Not Found
    @Test
    void shouldReturnEmptyWhenProductNotActive() {
        ProductEntity inactiveProduct = new ProductEntity(
            "prod-123",
            "Test Product",
            "test-product",
            "Test description",
            "brand-123",
            null,
            "cat-123",
            null,
            "default.jpg",
            "SEO Title",
            "SEO Desc",
            ProductStatus.DRAFT, // Not active - người dùng không thể xem
            LocalDateTime.now(),
            LocalDateTime.now(),
            null, null, null, null, null, null, null
        );

        when(productRepository.findProductById("prod-123")).thenReturn(Optional.of(inactiveProduct));

        Optional result = useCase.execute("prod-123");

        assertThat(result).isEmpty();
    }

    //kiểm tra khi sản phẩm tồn tại và ở trạng thái active - trả về chi tiết sản phẩm đầy đủ
    @Test
    void shouldReturnProductDetailsWhenProductExistsAndActive() {
        // Mock repository calls
        when(productRepository.findProductById("prod-123")).thenReturn(Optional.of(productEntity));
        when(productVariantRepository.findByProductId("prod-123")).thenReturn(List.of(variant));
        when(productImageRepository.findByProductId("prod-123")).thenReturn(List.of(image));
        when(reviewRepository.findByProductId("prod-123")).thenReturn(List.of(review));
        when(productTagRepository.findByProductId("prod-123")).thenReturn(List.of(productTag));
        when(brandRepository.findById("brand-123")).thenReturn(Optional.of(brand));
        when(categoryRepository.findById("cat-123")).thenReturn(Optional.of(category));
        when(tagRepository.findById("tag-123")).thenReturn(Optional.of(tag));

        // Execute
        Optional result = useCase.execute("prod-123");

        // Verify
        assertThat(result).isPresent();
        ProductDetailsDto dto = (ProductDetailsDto) result.get();

        assertThat(dto.getId()).isEqualTo("prod-123");
        assertThat(dto.getName()).isEqualTo("Test Product");
        assertThat(dto.getBrandName()).isEqualTo("Test Brand");
        assertThat(dto.getCategoryName()).isEqualTo("Test Category");
        assertThat(dto.getTags()).contains("Test Tag");
        assertThat(dto.getMinPrice()).isEqualTo(BigDecimal.valueOf(100.00));
        assertThat(dto.getMaxPrice()).isEqualTo(BigDecimal.valueOf(100.00));
        assertThat(dto.getStockStatus()).isEqualTo("in_stock"); // 50 > 10
        assertThat(dto.getVariants()).hasSize(1);
        assertThat(dto.getImages()).hasSize(1);
        assertThat(dto.getReviews()).hasSize(1);
    }

    //kiểm tra trạng thái tồn kho dựa trên tổng số lượng tồn kho của các biến thể sản phẩm
    @Test
    void shouldReturnLowStockStatusWhenTotalStockIsLow() {
        variant.setStockQuantity(5); // Low stock

        when(productRepository.findProductById("prod-123")).thenReturn(Optional.of(productEntity));
        when(productVariantRepository.findByProductId("prod-123")).thenReturn(List.of(variant));
        when(productImageRepository.findByProductId("prod-123")).thenReturn(List.of());
        when(reviewRepository.findByProductId("prod-123")).thenReturn(List.of());
        when(productTagRepository.findByProductId("prod-123")).thenReturn(List.of());

        Optional result = useCase.execute("prod-123");

        assertThat(result).isPresent();
        ProductDetailsDto dto = (ProductDetailsDto) result.get();
        assertThat(dto.getStockStatus()).isEqualTo("low_stock");
    }

    //kiểm tra trạng thái hết hàng khi tổng số lượng tồn kho của các biến thể sản phẩm bằng 0 hoặc không có biến thể nào
    @Test
    void shouldReturnOutOfStockStatusWhenNoStock() {
        variant.setStockQuantity(0); // Out of stock

        when(productRepository.findProductById("prod-123")).thenReturn(Optional.of(productEntity));
        when(productVariantRepository.findByProductId("prod-123")).thenReturn(List.of(variant));
        when(productImageRepository.findByProductId("prod-123")).thenReturn(List.of());
        when(reviewRepository.findByProductId("prod-123")).thenReturn(List.of());
        when(productTagRepository.findByProductId("prod-123")).thenReturn(List.of());

        Optional result = useCase.execute("prod-123");

        assertThat(result).isPresent();
        ProductDetailsDto dto = (ProductDetailsDto) result.get();
        assertThat(dto.getStockStatus()).isEqualTo("out_of_stock");
    }

    //kiểm tra trạng thái hết hàng khi không có biến thể sản phẩm
    @Test
    void shouldReturnOutOfStockStatusWhenNoVariants() {
        when(productRepository.findProductById("prod-123")).thenReturn(Optional.of(productEntity));
        when(productVariantRepository.findByProductId("prod-123")).thenReturn(List.of()); // No variants
        when(productImageRepository.findByProductId("prod-123")).thenReturn(List.of());
        when(reviewRepository.findByProductId("prod-123")).thenReturn(List.of());
        when(productTagRepository.findByProductId("prod-123")).thenReturn(List.of());

        Optional result = useCase.execute("prod-123");

        assertThat(result).isPresent();
        ProductDetailsDto dto = (ProductDetailsDto) result.get();
        assertThat(dto.getStockStatus()).isEqualTo("out_of_stock");
    }
}