package shopco.backend.application.interfaces;

import shopco.backend.application.dto.ProductSearchRequest;
import shopco.backend.application.dto.ProductSearchResponse;

public interface IProductService {
    ProductSearchResponse searchProducts(ProductSearchRequest request);
}
