package shopco.backend.application.interfaces;

import shopco.backend.application.dto.ProductDetailsDto;
import java.util.Optional;

public interface IProductServiceDetails {
    /**
     * Get product details by ID.
     *
     * @param productId the product ID
     * @return an Optional containing the ProductDetailsDto if found, or empty if not found
     */
    Optional<ProductDetailsDto> getProductDetails(String productId);
}