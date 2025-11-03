package shopco.backend.infrastructure.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopco.backend.application.dto.CartRequest;
import shopco.backend.application.dto.CartResponse;
import shopco.backend.application.dto.UpdateCartItemRequest;
import shopco.backend.application.interfaces.ICartService;
import shopco.backend.application.use_cases.AddToCartUseCase;
import shopco.backend.application.use_cases.ClearCartUseCase;
import shopco.backend.application.use_cases.GetCartUseCase;
import shopco.backend.application.use_cases.RemoveCartItemUseCase;
import shopco.backend.application.use_cases.UpdateCartItemUseCase;

@Service
public class CartServiceImpl implements ICartService {
    
    private final AddToCartUseCase addToCartUseCase;
    private final GetCartUseCase getCartUseCase;
    private final UpdateCartItemUseCase updateCartItemUseCase;
    private final RemoveCartItemUseCase removeCartItemUseCase;
    private final ClearCartUseCase clearCartUseCase;
    
    public CartServiceImpl(
            AddToCartUseCase addToCartUseCase,
            GetCartUseCase getCartUseCase,
            UpdateCartItemUseCase updateCartItemUseCase,
            RemoveCartItemUseCase removeCartItemUseCase,
            ClearCartUseCase clearCartUseCase) {
        this.addToCartUseCase = addToCartUseCase;
        this.getCartUseCase = getCartUseCase;
        this.updateCartItemUseCase = updateCartItemUseCase;
        this.removeCartItemUseCase = removeCartItemUseCase;
        this.clearCartUseCase = clearCartUseCase;
    }
    
    @Override
    @Transactional
    public CartResponse addToCart(CartRequest request) {
        return addToCartUseCase.execute(request);
    }
    
    @Override
    @Transactional(readOnly = true)
    public CartResponse getCartByUserId(String userId) {
        return getCartUseCase.executeByUserId(userId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public CartResponse getCartBySessionId(String sessionId) {
        return getCartUseCase.executeBySessionId(sessionId);
    }
    
    @Override
    @Transactional
    public CartResponse updateCartItemQuantity(String cartItemId, UpdateCartItemRequest request) {
        return updateCartItemUseCase.execute(cartItemId, request);
    }
    
    @Override
    @Transactional
    public void removeCartItem(String cartItemId) {
        removeCartItemUseCase.execute(cartItemId);
    }
    
    @Override
    @Transactional
    public void clearCart(String cartId) {
        clearCartUseCase.execute(cartId);
    }
}

