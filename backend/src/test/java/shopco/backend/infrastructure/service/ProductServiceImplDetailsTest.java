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

    // kiểm tra trung gian của service - service có gọi đúng use case và trả về đúng dữ liệu không
    // giả lập use case xem service có gọi được use case không
    @Mock
    private GetProductDetailsUseCase getProductDetailsUseCase;

    @InjectMocks
    private ProductServiceImplDetails productServiceDetails;

    //Use Case trả về dữ liệu → Service phải trả lại đúng dữ liệu đó
    @Test
    void shouldReturnProductDetailsWhenUseCaseReturnsData() {
        // Given - chuẩn bị dữ liệu giả lập
        ProductDetailsDto expectedDto = new ProductDetailsDto();
        expectedDto.setId("prod-123");
        expectedDto.setName("Test Product");

        when(getProductDetailsUseCase.execute("prod-123")).thenReturn(Optional.of(expectedDto));

        // When - gọi hàm service
        Optional<ProductDetailsDto> result = productServiceDetails.getProductDetails("prod-123");

        // Then - kiểm tra kết quả
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo("prod-123");
        assertThat(result.get().getName()).isEqualTo("Test Product");
    }


    //Use Case không có dữ liệu → Service cũng phải trả về Optional.empty()
    @Test
    void shouldReturnEmptyWhenUseCaseReturnsEmpty() {
        // Given - nếu sản phẩm không tồn tại thì use case trả về Optional.empty()
        when(getProductDetailsUseCase.execute("non-existent")).thenReturn(Optional.empty());

        // When - nhận kết quả từ service
        Optional<ProductDetailsDto> result = productServiceDetails.getProductDetails("non-existent");

        // Then - kiểm tra kết quả
        assertThat(result).isEmpty();
    }
}