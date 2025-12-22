package shopco.backend.application.use_cases;

import org.junit.jupiter.api.Test;
import shopco.backend.application.dto.ProductSearchRequest;
import shopco.backend.application.dto.ProductSearchResponse;
import shopco.backend.domain.entities.ProductEntity;
import shopco.backend.domain.repositories.IProductRepository;
import shopco.backend.infrastructure.repository.*;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SearchProductsUseCaseTest {

    // 1. Test Case: Input rỗng (Validation)
    @Test
    void testExecute_QueryEmpty() {
        // Input
        ProductSearchRequest request = new ProductSearchRequest("", 1, 10, null, null);

        // Dependencies (Không cần vì sẽ lỗi ngay từ đầu)
        SearchProductsUseCase useCase = new SearchProductsUseCase(null, null, null, null, null, null);

        // Execute & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            useCase.execute(request);
        });
    }

    // 2. Test Case: Không tìm thấy kết quả
    @Test
    void testExecute_NoResults() {
        // Input
        ProductSearchRequest request = new ProductSearchRequest("xyz", 1, 10, null, null);

        // Dependencies (Manual Stub - Giả lập thủ công)
        IProductRepository productRepo = new IProductRepository() {
            @Override
            public List<ProductEntity> searchProducts(String query, String categoryId, String brandId, int page,
                    int limit) {
                return Collections.emptyList();
            }

            @Override
            public long countSearchResults(String query, String categoryId, String brandId) {
                return 0;
            }

            @Override
            public List<ProductEntity> findAllProducts(String categoryId, String brandId, String status, int page,
                    int limit) {
                return Collections.emptyList();
            }

            @Override
            public long countAllProducts(String categoryId, String brandId, String status) {
                return 0;
            }
        };

        // UseCase (Manual Wiring)
        SearchProductsUseCase useCase = new SearchProductsUseCase(productRepo, null, null, null, null, null);

        // Execute
        ProductSearchResponse response = useCase.execute(request);

        // Assert
        assertTrue(response.getProducts().isEmpty());
        assertEquals(0, response.getPagination().getTotalCount());
    }

    // 3. Test Case: Tìm thấy kết quả
    @Test
    void testExecute_FoundResults() {
        // Input
        ProductSearchRequest request = new ProductSearchRequest("shirt", 1, 10, null, null);

        // Dependencies
        // Stub ProductRepository (Thủ công)
        IProductRepository productRepo = new IProductRepository() {
            @Override
            public List<ProductEntity> searchProducts(String query, String categoryId, String brandId, int page,
                    int limit) {
                ProductEntity p = new ProductEntity();
                p.setId("1");
                p.setName("T-Shirt");
                return List.of(p);
            }

            @Override
            public long countSearchResults(String query, String categoryId, String brandId) {
                return 1;
            }

            @Override
            public List<ProductEntity> findAllProducts(String categoryId, String brandId, String status, int page,
                    int limit) {
                return Collections.emptyList();
            }

            @Override
            public long countAllProducts(String categoryId, String brandId, String status) {
                return 0;
            }
        };

        // Mock các repo phụ (Vì là Interface JPA phức tạp, dùng mock() để tạo object giả)
        ProductVariantRepository variantRepo = mock(ProductVariantRepository.class);
        ProductTagRepository tagRepo = mock(ProductTagRepository.class);
        BrandRepository brandRepo = mock(BrandRepository.class);
        CategoryRepository categoryRepo = mock(CategoryRepository.class);
        TagRepository tagRepository = mock(TagRepository.class);

        // Setup hành vi cho mock phụ (để tránh NullPointerException khi UseCase gọi)
        when(variantRepo.findByProductId(anyString())).thenReturn(Collections.emptyList());
        when(tagRepo.findByProductId(anyString())).thenReturn(Collections.emptyList());

        // UseCase (Manual Wiring)
        SearchProductsUseCase useCase = new SearchProductsUseCase(
                productRepo, variantRepo, tagRepo, brandRepo, categoryRepo, tagRepository);

        // Execute
        ProductSearchResponse response = useCase.execute(request);

        // Assert
        assertEquals(1, response.getProducts().size());
        assertEquals("T-Shirt", response.getProducts().get(0).getName());
    }
}
