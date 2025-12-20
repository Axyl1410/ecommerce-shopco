package shopco.backend.infrastructure.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import shopco.backend.application.dto.ProductDetailsDto;
import shopco.backend.application.interfaces.IProductServiceDetails;
import shopco.backend.application.use_cases.GetProductDetailsUseCase;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplDetailsTest {

    @Mock
    private GetProductDetailsUseCase getProductDetailsUseCase;

    @InjectMocks
    private ProductServiceImplDetails productServiceDetails;

    @Test
    void shouldReturnProductDetailsWhenUseCaseReturnsData() {
        // Given
        ProductDetailsDto expectedDto = new ProductDetailsDto();
        expectedDto.setId("prod-123");
        expectedDto.setName("Test Product");

        when(getProductDetailsUseCase.execute("prod-123")).thenReturn(Optional.of(expectedDto));

        // When
        Optional<ProductDetailsDto> result = productServiceDetails.getProductDetails("prod-123");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo("prod-123");
        assertThat(result.get().getName()).isEqualTo("Test Product");
    }

    @Test
    void shouldReturnEmptyWhenUseCaseReturnsEmpty() {
        // Given
        when(getProductDetailsUseCase.execute("non-existent")).thenReturn(Optional.empty());

        // When
        Optional<ProductDetailsDto> result = productServiceDetails.getProductDetails("non-existent");

        // Then
        assertThat(result).isEmpty();
    }
}