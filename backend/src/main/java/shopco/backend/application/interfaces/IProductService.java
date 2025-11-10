package shopco.backend.application.interfaces;

import shopco.backend.application.dto.ProductSearchRequest;
import shopco.backend.application.dto.ProductSearchResponse;
import shopco.backend.application.dto.ProductListRequest;

public interface IProductService {
    ProductSearchResponse searchProducts(ProductSearchRequest request);

    ProductSearchResponse getAllProducts(ProductListRequest request);
}
