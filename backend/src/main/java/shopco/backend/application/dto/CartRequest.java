package shopco.backend.application.dto;

public record CartRequest(
    String userId,
    String sessionId,
    String variantId,
    Integer quantity
) {
    public CartRequest {
        if (variantId == null || variantId.isBlank()) {
            throw new IllegalArgumentException("Variant ID cannot be null or empty");
        }
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        if ((userId == null || userId.isBlank()) && (sessionId == null || sessionId.isBlank())) {
            throw new IllegalArgumentException("Either userId or sessionId must be provided");
        }
    }
}

