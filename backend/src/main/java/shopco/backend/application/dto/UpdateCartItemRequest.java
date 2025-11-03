package shopco.backend.application.dto;

public record UpdateCartItemRequest(Integer quantity) {
    public UpdateCartItemRequest {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
    }
}

