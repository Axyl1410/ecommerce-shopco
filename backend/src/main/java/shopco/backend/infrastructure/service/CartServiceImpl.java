package shopco.backend.infrastructure.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopco.backend.application.dto.AddToCartRequest;
import shopco.backend.application.dto.CartResponse;
import shopco.backend.application.dto.UpdateCartItemRequest;
import shopco.backend.application.interfaces.ICartService;
import shopco.backend.application.use_cases.AddToCartUseCase;
import shopco.backend.application.use_cases.GetCartUseCase;
import shopco.backend.domain.entities.CartItemEntity;
import shopco.backend.domain.repositories.ICartItemRepository;
import shopco.backend.domain.repositories.ICartRepository;

@Service
public class CartServiceImpl implements ICartService {
    
    private final AddToCartUseCase addToCartUseCase;
    private final GetCartUseCase getCartUseCase;
    private final ICartItemRepository cartItemRepository;
    private final ICartRepository cartRepository;
    
    public CartServiceImpl(
            AddToCartUseCase addToCartUseCase,
            GetCartUseCase getCartUseCase,
            ICartItemRepository cartItemRepository,
            ICartRepository cartRepository) {
        this.addToCartUseCase = addToCartUseCase;
        this.getCartUseCase = getCartUseCase;
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
    }
    
    @Override
    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
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
        CartItemEntity cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        cartItem.setQuantity(request.quantity());
        cartItemRepository.save(cartItem);
        
        return getCartUseCase.executeByUserId(cartItem.getCartId());
    }
    
    @Override
    @Transactional
    public void removeCartItem(String cartItemId) {
        if (!cartItemRepository.findById(cartItemId).isPresent()) {
            throw new RuntimeException("Cart item not found");
        }
        cartItemRepository.deleteById(cartItemId);
    }
    
    @Override
    @Transactional
    public void clearCart(String cartId) {
        if (!cartRepository.existsById(cartId)) {
            throw new RuntimeException("Cart not found");
        }
        cartItemRepository.deleteByCartId(cartId);
    }
}

