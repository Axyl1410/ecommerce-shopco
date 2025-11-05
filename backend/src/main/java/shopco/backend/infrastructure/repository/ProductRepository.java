package shopco.backend.infrastructure.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    @Query("SELECT DISTINCT p FROM Product p " +
            "WHERE (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:categoryId IS NULL OR p.categoryId = :categoryId) " +
            "AND (:brandId IS NULL OR p.brandId = :brandId)")
    Page<Product> searchProducts(@Param("query") String query,
            @Param("categoryId") String categoryId,
            @Param("brandId") String brandId,
            Pageable pageable);
}
