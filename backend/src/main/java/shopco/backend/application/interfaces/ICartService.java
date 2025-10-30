package shopco.backend.application.interfaces;

import shopco.backend.application.dto.AddToCartRequest;
import shopco.backend.application.dto.CartResponse;
import shopco.backend.application.dto.UpdateCartItemRequest;

public interface ICartService {
    CartResponse addToCart(AddToCartRequest request);
    CartResponse getCartByUserId(String userId);
    CartResponse getCartBySessionId(String sessionId);
    CartResponse updateCartItemQuantity(String cartItemId, UpdateCartItemRequest request);
    void removeCartItem(String cartItemId);
    void clearCart(String cartId);
}

