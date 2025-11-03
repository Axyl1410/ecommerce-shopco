package shopco.backend.application.use_cases;

import org.springframework.stereotype.Component;
import shopco.backend.application.dto.CartResponse;
import shopco.backend.infrastructure.model.Cart;
import shopco.backend.infrastructure.repository.CartRepository;
import shopco.backend.infrastructure.repository.CartItemRepository;
import shopco.backend.infrastructure.repository.ProductVariantRepository;
import shopco.backend.infrastructure.repository.ProductRepository;
import java.util.Collections;
import java.util.Optional;

@Component
public class GetCartUseCase {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    
    public GetCartUseCase(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductVariantRepository productVariantRepository,
            ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.productRepository = productRepository;
    }
    
    public CartResponse executeByUserId(String userId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        
        if (cartOpt.isEmpty()) {
            // Return empty cart response
            return createEmptyCartResponse(null, userId);
        }
        
        CartResponseBuilder builder = new CartResponseBuilder(
            cartRepository, 
            cartItemRepository,
            productVariantRepository,
            productRepository);
        return builder.build(cartOpt.get().getId());
    }
    
    public CartResponse executeBySessionId(String sessionId) {
        Optional<Cart> cartOpt = cartRepository.findBySessionId(sessionId);
        
        if (cartOpt.isEmpty()) {
            // Return empty cart response
            return createEmptyCartResponse(sessionId, null);
        }
        
        CartResponseBuilder builder = new CartResponseBuilder(
            cartRepository, 
            cartItemRepository,
            productVariantRepository,
            productRepository);
        return builder.build(cartOpt.get().getId());
    }
    
    private CartResponse createEmptyCartResponse(String sessionId, String userId) {
        return new CartResponse(
            null,
            userId,
            sessionId,
            Collections.emptyList(),
            java.math.BigDecimal.ZERO,
            0,
            java.time.LocalDateTime.now(),
            java.time.LocalDateTime.now()
        );
    }
}

