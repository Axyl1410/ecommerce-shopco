package shopco.backend.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CartItemResponse(
    String id,
    String cartId,
    String variantId,
    String variantName,
    String variantSku,
    String variantAttributes,
    Integer quantity,
    BigDecimal priceAtAdd,
    BigDecimal subtotal,
    LocalDateTime createdAt
) {
    public CartItemResponse {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Cart item ID cannot be null or blank");
        }
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        if (priceAtAdd == null || priceAtAdd.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price must be non-negative");
        }
    }
}

