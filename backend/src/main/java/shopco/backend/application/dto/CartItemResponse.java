package shopco.backend.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CartItemResponse(
    String id,
    String cartId,
    String variantId,
    String productName,
    String imageUrl,
    String sku,
    String attributes,
    Integer quantity,
    BigDecimal priceAtAdd,
    BigDecimal subtotal,
    LocalDateTime createdAt
) {}

