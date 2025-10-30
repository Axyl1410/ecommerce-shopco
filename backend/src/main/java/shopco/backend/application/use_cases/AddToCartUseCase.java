package shopco.backend.application.use_cases;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import shopco.backend.application.dto.AddToCartRequest;
import shopco.backend.application.dto.CartItemResponse;
import shopco.backend.application.dto.CartResponse;
import shopco.backend.domain.entities.CartEntity;
import shopco.backend.domain.entities.CartItemEntity;
import shopco.backend.domain.entities.ProductVariantEntity;
import shopco.backend.domain.repositories.ICartItemRepository;
import shopco.backend.domain.repositories.ICartRepository;
import shopco.backend.domain.repositories.IProductVariantRepository;

@Component
public class AddToCartUseCase {
    
    private final ICartRepository cartRepository;
    private final ICartItemRepository cartItemRepository;
    private final IProductVariantRepository productVariantRepository;
    
    public AddToCartUseCase(
            ICartRepository cartRepository,
            ICartItemRepository cartItemRepository,
            IProductVariantRepository productVariantRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
    }
    
    public CartResponse execute(AddToCartRequest request) {
        // 1. Validate product variant exists
        ProductVariantEntity variant = productVariantRepository.findById(request.variantId())
            .orElseThrow(() -> new RuntimeException("Product variant not found"));
        
        // 2. Check stock availability
        if (variant.getStockQuantity() < request.quantity()) {
            throw new RuntimeException("Insufficient stock");
        }
        
        // 3. Find or create cart
        CartEntity cart = findOrCreateCart(request.userId(), request.sessionId());
        
        // 4. Check if item already exists in cart
        Optional<CartItemEntity> existingItem = cartItemRepository
            .findByCartIdAndVariantId(cart.getId(), request.variantId());
        
        CartItemEntity cartItem;
        if (existingItem.isPresent()) {
            // Update quantity
            cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + request.quantity();
            
            if (variant.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock");
            }
            
            cartItem.setQuantity(newQuantity);
        } else {
            // Create new cart item
            cartItem = new CartItemEntity();
            cartItem.setId(UUID.randomUUID().toString());
            cartItem.setCartId(cart.getId());
            cartItem.setVariantId(request.variantId());
            cartItem.setQuantity(request.quantity());
            cartItem.setPriceAtAdd(variant.getSalePrice() != null ? variant.getSalePrice() : variant.getPrice());
            cartItem.setCreatedAt(LocalDateTime.now());
        }
        
        // 5. Save cart item
        cartItemRepository.save(cartItem);
        
        // 6. Update cart timestamp
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        
        // 7. Return cart response
        return buildCartResponse(cart);
    }
    
    private CartEntity findOrCreateCart(String userId, String sessionId) {
        Optional<CartEntity> existingCart;
        
        if (userId != null && !userId.isBlank()) {
            existingCart = cartRepository.findByUserId(userId);
        } else {
            existingCart = cartRepository.findBySessionId(sessionId);
        }
        
        if (existingCart.isPresent()) {
            return existingCart.get();
        }
        
        // Create new cart
        CartEntity newCart = new CartEntity();
        newCart.setId(UUID.randomUUID().toString());
        newCart.setUserId(userId);
        newCart.setSessionId(sessionId);
        newCart.setCreatedAt(LocalDateTime.now());
        newCart.setUpdatedAt(LocalDateTime.now());
        
        return cartRepository.save(newCart);
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

