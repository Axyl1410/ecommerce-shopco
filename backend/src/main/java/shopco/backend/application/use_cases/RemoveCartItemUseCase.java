package shopco.backend.application.use_cases;

import org.springframework.stereotype.Component;
import shopco.backend.infrastructure.model.Cart;
import shopco.backend.infrastructure.model.CartItem;
import shopco.backend.infrastructure.repository.CartRepository;
import shopco.backend.infrastructure.repository.CartItemRepository;
import java.time.LocalDateTime;

@Component
public class RemoveCartItemUseCase {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    
    public RemoveCartItemUseCase(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }
    
    public void execute(String cartItemId) {
        // 1. Find cart item
        CartItem cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        String cartId = cartItem.getCartId();
        
        // 2. Delete cart item
        cartItemRepository.deleteById(cartItemId);
        
        // 3. Update cart timestamp
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }
}

