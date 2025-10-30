package shopco.backend.application.use_cases;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import shopco.backend.application.dto.CartItemResponse;
import shopco.backend.application.dto.CartResponse;
import shopco.backend.domain.entities.CartEntity;
import shopco.backend.domain.entities.CartItemEntity;
import shopco.backend.domain.entities.ProductVariantEntity;
import shopco.backend.domain.repositories.ICartItemRepository;
import shopco.backend.domain.repositories.ICartRepository;
import shopco.backend.domain.repositories.IProductVariantRepository;

@Component
public class GetCartUseCase {
    
    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;
    private final IProductVariantRepository productVariantRepository;
    
    public GetCartUseCase(
            ICartRepository cartRepository,
            ICartItemRepository cartItemRepository,
            IProductVariantRepository productVariantRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
    }
    
    public CartResponse executeByUserId(String userId) {
        CartEntity cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Cart not found for user"));
        
        return buildCartResponse(cart);
    }
    
    public CartResponse executeBySessionId(String sessionId) {
        CartEntity cart = cartRepository.findBySessionId(sessionId)
            .orElseThrow(() -> new RuntimeException("Cart not found for session"));
        
        return buildCartResponse(cart);
    }
    
    private CartResponse buildCartResponse(CartEntity cart) {
        List<CartItemEntity> items = cartItemRepository.findByCartId(cart.getId());
        
        List<CartItemResponse> itemResponses = items.stream()
            .map(this::toCartItemResponse)
            .collect(Collectors.toList());
        
        BigDecimal totalAmount = itemResponses.stream()
            .map(CartItemResponse::subtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Integer totalItems = itemResponses.stream()
            .map(CartItemResponse::quantity)
            .reduce(0, Integer::sum);
        
        return new CartResponse(
            cart.getId(),
            cart.getUserId(),
            cart.getSessionId(),
            itemResponses,
            totalAmount,
            totalItems,
            cart.getCreatedAt(),
            cart.getUpdatedAt()
        );
    }
    
    private CartItemResponse toCartItemResponse(CartItemEntity item) {
        ProductVariantEntity variant = productVariantRepository.findById(item.getVariantId())
            .orElseThrow(() -> new RuntimeException("Product variant not found"));
        
        BigDecimal subtotal = item.getPriceAtAdd().multiply(new BigDecimal(item.getQuantity()));
        
        return new CartItemResponse(
            item.getId(),
            item.getCartId(),
            item.getVariantId(),
            variant.getProduct() != null ? variant.getProduct().getName() : "Unknown",
            variant.getSku(),
            variant.getAttributes(),
            item.getQuantity(),
            item.getPriceAtAdd(),
            subtotal,
            item.getCreatedAt()
        );
    }
}

