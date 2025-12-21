package shopco.backend.interfaces.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import shopco.backend.application.dto.ProductDetailsDto;
import shopco.backend.application.interfaces.IProductServiceDetails;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductDetailsController.class)
class ProductDetailsControllerTest {

    // kiểm tra controller có trả về đúng dữ liệu khi gọi - khi khi sản phẩm tồn tại hoặc không tồn tại.
    //mô phỏng CRUD
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IProductServiceDetails productServiceDetails;


    // sản phẩm tồn tại trả về 200 + dữ liệu
    @Test
    void shouldReturnProductDetailsWhenProductExists() throws Exception {
        // Given
        ProductDetailsDto productDetails = createTestProductDetails();
        when(productServiceDetails.getProductDetails("prod-123")).thenReturn(Optional.of(productDetails));

        // When & Then
        mockMvc.perform(get("/products/prod-123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("prod-123"))
            .andExpect(jsonPath("$.name").value("Test Product"))
            .andExpect(jsonPath("$.stockStatus").value("in_stock"));
    }


    // sản phẩm không tồn tại trả về 404
    @Test
    void shouldReturnNotFoundWhenProductDoesNotExist() throws Exception {
        // Given
        when(productServiceDetails.getProductDetails("non-existent")).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/products/non-existent"))
            .andExpect(status().isNotFound());
    }

    //tạo dữ liệu sản phẩm mẫu để test
    private ProductDetailsDto createTestProductDetails() {
        return new ProductDetailsDto(
            "prod-123",
            "Test Product",
            "test-product",
            "Test description",
            "brand-123",
            "Test Brand",
            "cat-123",
            "Test Category",
            "default.jpg",
            "SEO Title",
            "SEO Desc",
            "ACTIVE",
            LocalDateTime.now(),
            LocalDateTime.now(),
            List.of(), // variants
            List.of(), // images
            List.of(), // reviews
            List.of("tag1", "tag2"), // tags
            BigDecimal.valueOf(100.00),
            BigDecimal.valueOf(200.00),
            "in_stock"
        );
    }
}