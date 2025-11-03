package shopco.backend.application.use_cases;

import org.springframework.stereotype.Component;
import shopco.backend.infrastructure.model.Cart;
import shopco.backend.infrastructure.repository.CartRepository;
import shopco.backend.infrastructure.repository.CartItemRepository;
import java.time.LocalDateTime;

@Component
public class ClearCartUseCase {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    
    public ClearCartUseCase(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }
    
    public void execute(String cartId) {
        // 1. Verify cart exists
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        // 2. Delete all cart items
        cartItemRepository.deleteByCartId(cartId);
        
        // 3. Update cart timestamp
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }
}

