package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Product;
import shopco.backend.domain.repositories.IProductRepositoryDetails;
import shopco.backend.domain.entities.ProductEntity;
import java.util.Optional;

@Repository
public interface ProductRepositoryDetails extends JpaRepository<Product, String>, IProductRepositoryDetails {

    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findProductByIdInternal(String id);

    @Override
    default Optional<ProductEntity> findProductById(String id) {
        Optional<Product> productOpt = findProductByIdInternal(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            // Convert Product to ProductEntity
            // This is a simplified conversion - in real implementation, you'd map all fields
            return Optional.of(new ProductEntity(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getBrandId(),
                null, // brand entity - would need to fetch
                product.getCategoryId(),
                null, // category entity - would need to fetch
                product.getDefaultImage(),
                product.getSeoMetaTitle(),
                product.getSeoMetaDesc(),
                product.getStatus(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                null, // variants - would need to fetch
                null, // images - would need to fetch
                null, // reviews - would need to fetch
                null, // wishlistItems - would need to fetch
                null, // tags - would need to fetch
                null, // applicableCoupons - would need to fetch
                null  // excludedCoupons - would need to fetch
            ));
        }
        return Optional.empty();
    }
}