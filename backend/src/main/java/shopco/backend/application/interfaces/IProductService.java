package shopco.backend.application.interfaces;

import shopco.backend.application.dto.ProductSearchRequest;
import shopco.backend.application.dto.ProductSearchResponse;
import shopco.backend.application.dto.ProductListRequest;

public interface IProductService {
    /**
 * Searches for products that match the criteria provided in the request.
 *
 * @param request criteria for filtering, sorting, and pagination of products
 * @return a ProductSearchResponse containing matching products and pagination metadata
 */
ProductSearchResponse searchProducts(ProductSearchRequest request);

    /**
 * Retrieve products using the criteria, filters, sorting, and pagination specified in the request.
 *
 * @param request parameters for listing products (filters, sort order, pagination, etc.)
 * @return a ProductSearchResponse containing the matching products and related metadata (for example total count)
 */
ProductSearchResponse getAllProducts(ProductListRequest request);
}