package shopco.backend.domain.repositories;

import shopco.backend.domain.entities.ProductEntity;
import java.util.Optional;

public interface IProductRepositoryDetails {
    /**
     * Find a product by its ID.
     *
     * @param id the product ID
     * @return an Optional containing the ProductEntity if found, or empty if not found
     */
    Optional<ProductEntity> findProductById(String id);
}