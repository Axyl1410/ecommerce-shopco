package shopco.backend.infrastructure.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopco.backend.application.dto.ProductSearchRequest;
import shopco.backend.application.dto.ProductSearchResponse;
import shopco.backend.application.dto.ProductListRequest;
import shopco.backend.application.interfaces.IProductService;
import shopco.backend.application.use_cases.SearchProductsUseCase;
import shopco.backend.application.use_cases.GetAllProductsUseCase;

@Service
public class ProductServiceImpl implements IProductService {

    private final SearchProductsUseCase searchProductsUseCase;
    private final GetAllProductsUseCase getAllProductsUseCase;

    public ProductServiceImpl(SearchProductsUseCase searchProductsUseCase,
            GetAllProductsUseCase getAllProductsUseCase) {
        this.searchProductsUseCase = searchProductsUseCase;
        this.getAllProductsUseCase = getAllProductsUseCase;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductSearchResponse searchProducts(ProductSearchRequest request) {
        return searchProductsUseCase.execute(request);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductSearchResponse getAllProducts(ProductListRequest request) {
        return getAllProductsUseCase.execute(request);
    }
}
