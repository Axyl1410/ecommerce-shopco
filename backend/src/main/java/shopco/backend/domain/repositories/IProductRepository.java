package shopco.backend.domain.repositories;

import shopco.backend.domain.entities.ProductEntity;
import java.util.List;

public interface IProductRepository {
    List<ProductEntity> searchProducts(String query, String categoryId, String brandId, int page, int limit);

    long countSearchResults(String query, String categoryId, String brandId);

    List<ProductEntity> findAllProducts(String categoryId, String brandId, String status, int page, int limit);

    long countAllProducts(String categoryId, String brandId, String status);
}
