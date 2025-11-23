package shopco.backend.domain.repositories;

import shopco.backend.domain.entities.ProductEntity;
import java.util.List;

public interface IProductRepository {
    /**
 * Search for products matching a free-text query and optional category or brand filters, returning a single page of results.
 *
 * @param query      free-text search string to match against product fields (may be null or empty to match all)
 * @param categoryId optional category ID to filter results (may be null to ignore)
 * @param brandId    optional brand ID to filter results (may be null to ignore)
 * @param page       page number for pagination
 * @param limit      maximum number of products to return in the page
 * @return           a list of ProductEntity objects that match the provided search criteria for the requested page
 */
List<ProductEntity> searchProducts(String query, String categoryId, String brandId, int page, int limit);

    /**
 * Count the total number of products that match the given search criteria.
 *
 * @param query      text to search for in product fields; empty or null disables text filtering
 * @param categoryId optional category identifier to filter results; null or empty disables category filtering
 * @param brandId    optional brand identifier to filter results; null or empty disables brand filtering
 * @return           the number of products matching the provided query and optional filters
 */
long countSearchResults(String query, String categoryId, String brandId);

    /**
 * Retrieve products filtered by optional category, brand, and status with pagination.
 *
 * @param categoryId optional category identifier to filter results; pass {@code null} or empty to ignore this filter
 * @param brandId    optional brand identifier to filter results; pass {@code null} or empty to ignore this filter
 * @param status     optional product status to filter results (e.g., active/inactive); pass {@code null} or empty to ignore this filter
 * @param page       page index for pagination
 * @param limit      maximum number of products to return for the requested page
 * @return           a list of ProductEntity objects matching the provided filters for the specified page
 */
List<ProductEntity> findAllProducts(String categoryId, String brandId, String status, int page, int limit);

    /**
 * Counts the total number of products that match the provided optional category, brand, and status filters.
 *
 * @param categoryId filter by category ID; pass null or empty to ignore this filter
 * @param brandId    filter by brand ID; pass null or empty to ignore this filter
 * @param status     filter by product status (e.g., "active", "inactive"); pass null or empty to ignore this filter
 * @return the number of products matching the supplied filters
 */
long countAllProducts(String categoryId, String brandId, String status);
}