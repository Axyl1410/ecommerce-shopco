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

    /**
     * Creates a ProductServiceImpl and sets its use-case dependencies.
     *
     * @param searchProductsUseCase use case responsible for handling product search requests
     * @param getAllProductsUseCase use case responsible for retrieving lists of products
     */
    public ProductServiceImpl(SearchProductsUseCase searchProductsUseCase,
            GetAllProductsUseCase getAllProductsUseCase) {
        this.searchProductsUseCase = searchProductsUseCase;
        this.getAllProductsUseCase = getAllProductsUseCase;
    }

    /**
     * Searches for products that match the provided search criteria.
     *
     * @param request search criteria and options (filters, pagination, sorting)
     * @return a ProductSearchResponse containing the matching products and related metadata
     */
    @Override
    @Transactional(readOnly = true)
    public ProductSearchResponse searchProducts(ProductSearchRequest request) {
        return searchProductsUseCase.execute(request);
    }

    /**
     * Retrieves a list of products according to the provided list request.
     *
     * @param request criteria and pagination options for listing products
     * @return a ProductSearchResponse containing the matching products and related metadata (e.g., pagination info)
     */
    @Override
    @Transactional(readOnly = true)
    public ProductSearchResponse getAllProducts(ProductListRequest request) {
        return getAllProductsUseCase.execute(request);
    }
}