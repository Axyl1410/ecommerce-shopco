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

        /**
                         * Finds distinct products whose name or description contains the given query, with optional category and brand filters.
                         *
                         * @param query the text to match against product name or description (case-insensitive, substring match)
                         * @param categoryId optional category id to restrict results; if `null` no category filtering is applied
                         * @param brandId optional brand id to restrict results; if `null` no brand filtering is applied
                         * @param pageable pagination and sorting information
                         * @return a page of distinct products matching the query and applied filters
                         */
                        @Query("SELECT DISTINCT p FROM Product p " +
                        "WHERE (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
                        "   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
                        "AND (:categoryId IS NULL OR p.categoryId = :categoryId) " +
                        "AND (:brandId IS NULL OR p.brandId = :brandId)")
        Page<Product> searchProducts(@Param("query") String query,
                        @Param("categoryId") String categoryId,
                        @Param("brandId") String brandId,
                        Pageable pageable);

        /**
                         * Retrieve a distinct page of products optionally filtered by category, brand, and status, ordered by creation time descending.
                         *
                         * @param categoryId filter by category id; if null, no category filter is applied
                         * @param brandId filter by brand id; if null, no brand filter is applied
                         * @param status product status as a string; if null, no status filter is applied
                         * @param pageable paging and sorting information
                         * @return a page of matching Product entities ordered by createdAt descending
                         */
                        @Query("SELECT DISTINCT p FROM Product p " +
                        "WHERE (:categoryId IS NULL OR p.categoryId = :categoryId) " +
                        "AND (:brandId IS NULL OR p.brandId = :brandId) " +
                        "AND (:status IS NULL OR CAST(p.status AS string) = :status) " +
                        "ORDER BY p.createdAt DESC")
        Page<Product> findAllProducts(@Param("categoryId") String categoryId,
                        @Param("brandId") String brandId,
                        @Param("status") String status,
                        Pageable pageable);
}