package shopco.backend.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddToCartRequest(
    @NotBlank(message = "Variant ID is required")
    String variantId,
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    Integer quantity,
    
    String userId,
    String sessionId
) {
    public AddToCartRequest {
        if (variantId == null || variantId.isBlank()) {
            throw new IllegalArgumentException("Variant ID cannot be null or blank");
        }
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        if ((userId == null || userId.isBlank()) && (sessionId == null || sessionId.isBlank())) {
            throw new IllegalArgumentException("Either userId or sessionId must be provided");
        }
    }
}

