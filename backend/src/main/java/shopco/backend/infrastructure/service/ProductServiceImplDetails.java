package shopco.backend.infrastructure.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopco.backend.application.dto.ProductDetailsDto;
import shopco.backend.application.interfaces.IProductServiceDetails;
import shopco.backend.application.use_cases.GetProductDetailsUseCase;
import java.util.Optional;

@Service
public class ProductServiceImplDetails implements IProductServiceDetails {

    private final GetProductDetailsUseCase getProductDetailsUseCase;

    public ProductServiceImplDetails(GetProductDetailsUseCase getProductDetailsUseCase) {
        this.getProductDetailsUseCase = getProductDetailsUseCase;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductDetailsDto> getProductDetails(String productId) {
        return getProductDetailsUseCase.execute(productId);
    }
}