package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.ProductVariant;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, String> {

    @Query("SELECT pv FROM ProductVariant pv WHERE pv.productId = :productId")
    List<ProductVariant> findByProductId(@Param("productId") String productId);

    /**
     * Count variants for a product
     */
    @Query("SELECT COUNT(pv) FROM ProductVariant pv WHERE pv.productId = :productId")
    int countByProductId(@Param("productId") String productId);

    /**
     * Delete all variants for a product
     */
    void deleteByProductId(String productId);
}
