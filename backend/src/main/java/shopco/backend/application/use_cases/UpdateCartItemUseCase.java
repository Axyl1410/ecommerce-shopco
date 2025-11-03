package shopco.backend.application.use_cases;

import org.springframework.stereotype.Component;
import shopco.backend.application.dto.CartResponse;
import shopco.backend.application.dto.UpdateCartItemRequest;
import shopco.backend.infrastructure.model.Cart;
import shopco.backend.infrastructure.model.CartItem;
import shopco.backend.infrastructure.repository.CartRepository;
import shopco.backend.infrastructure.repository.CartItemRepository;
import shopco.backend.infrastructure.repository.ProductVariantRepository;
import shopco.backend.infrastructure.repository.ProductRepository;
import shopco.backend.infrastructure.model.ProductVariant;
import java.time.LocalDateTime;

@Component
public class UpdateCartItemUseCase {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    
    public UpdateCartItemUseCase(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductVariantRepository productVariantRepository,
            ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.productRepository = productRepository;
    }
    
    public CartResponse execute(String cartItemId, UpdateCartItemRequest request) {
        // 1. Find cart item
        CartItem cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        // 2. Validate stock availability
        ProductVariant variant = productVariantRepository.findById(cartItem.getVariantId())
            .orElseThrow(() -> new RuntimeException("Product variant not found"));
        
        if (variant.getStockQuantity() < request.quantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + variant.getStockQuantity());
        }
        
        // 3. Update quantity
        cartItem.setQuantity(request.quantity());
        cartItemRepository.save(cartItem);
        
        // 4. Update cart timestamp
        Cart cart = cartRepository.findById(cartItem.getCartId())
            .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        
        // 5. Return updated cart
        CartResponseBuilder builder = new CartResponseBuilder(
            cartRepository, 
            cartItemRepository,
            productVariantRepository,
            productRepository);
        return builder.build(cart.getId());
    }
}

