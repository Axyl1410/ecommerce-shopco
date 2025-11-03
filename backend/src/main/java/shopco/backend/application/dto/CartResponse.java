package shopco.backend.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CartResponse(
    String id,
    String userId,
    String sessionId,
    List<CartItemResponse> items,
    BigDecimal totalAmount,
    Integer totalItems,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}

