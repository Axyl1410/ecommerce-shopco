package shopco.backend.domain.repositories;

import java.util.Optional;

import shopco.backend.domain.entities.ProductVariantEntity;

public interface IProductVariantRepository {
    Optional<ProductVariantEntity> findById(String id);
    ProductVariantEntity save(ProductVariantEntity variant);
}

