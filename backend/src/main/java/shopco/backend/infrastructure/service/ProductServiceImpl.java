package shopco.backend.infrastructure.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopco.backend.application.dto.ProductSearchRequest;
import shopco.backend.application.dto.ProductSearchResponse;
import shopco.backend.application.interfaces.IProductService;
import shopco.backend.application.use_cases.SearchProductsUseCase;

@Service
public class ProductServiceImpl implements IProductService {

    private final SearchProductsUseCase searchProductsUseCase;

    public ProductServiceImpl(SearchProductsUseCase searchProductsUseCase) {
        this.searchProductsUseCase = searchProductsUseCase;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductSearchResponse searchProducts(ProductSearchRequest request) {
        return searchProductsUseCase.execute(request);
    }
}
