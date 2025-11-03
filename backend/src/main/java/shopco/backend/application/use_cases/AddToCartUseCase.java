package shopco.backend.application.use_cases;

import org.springframework.stereotype.Component;
import shopco.backend.application.dto.CartRequest;
import shopco.backend.application.dto.CartResponse;
import shopco.backend.infrastructure.model.Cart;
import shopco.backend.infrastructure.model.CartItem;
import shopco.backend.infrastructure.repository.CartRepository;
import shopco.backend.infrastructure.repository.CartItemRepository;
import shopco.backend.infrastructure.repository.ProductVariantRepository;
import shopco.backend.infrastructure.repository.ProductRepository;
import shopco.backend.infrastructure.model.ProductVariant;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Component
public class AddToCartUseCase {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    
    public AddToCartUseCase(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductVariantRepository productVariantRepository,
            ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.productRepository = productRepository;
    }
    
    public CartResponse execute(CartRequest request) {
        // 1. Validate variant exists and get price
        ProductVariant variant = productVariantRepository.findById(request.variantId())
            .orElseThrow(() -> new RuntimeException("Product variant not found: " + request.variantId()));
        
        // 2. Check stock availability
        if (variant.getStockQuantity() < request.quantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + variant.getStockQuantity());
        }
        
        // 3. Get price (use salePrice if available, otherwise use price)
        BigDecimal price = variant.getSalePrice() != null && variant.getSalePrice().compareTo(BigDecimal.ZERO) > 0
            ? variant.getSalePrice()
            : variant.getPrice();
        
        // 4. Find or create cart
        Cart cart = findOrCreateCart(request.userId(), request.sessionId());
        
        // 5. Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository
            .findByCartIdAndVariantId(cart.getId(), request.variantId());
        
        CartItem cartItem;
        if (existingItem.isPresent()) {
            // Update quantity
            cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + request.quantity();
            
            // Check stock again with new total quantity
            if (variant.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock. Available: " + variant.getStockQuantity() + ", requested: " + newQuantity);
            }
            
            cartItem.setQuantity(newQuantity);
            // Update price to latest price
            cartItem.setPriceAtAdd(price);
        } else {
            // Create new cart item
            cartItem = new CartItem();
            cartItem.setId(UUID.randomUUID().toString());
            cartItem.setCartId(cart.getId());
            cartItem.setVariantId(request.variantId());
            cartItem.setQuantity(request.quantity());
            cartItem.setPriceAtAdd(price);
            cartItem.setCreatedAt(LocalDateTime.now());
        }
        
        // 6. Save cart item
        cartItemRepository.save(cartItem);
        
        // 7. Update cart timestamp
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        
        // 8. Return cart response
        CartResponseBuilder builder = new CartResponseBuilder(
            cartRepository, 
            cartItemRepository, 
            productVariantRepository,
            productRepository);
        return builder.build(cart.getId());
    }
    
    private Cart findOrCreateCart(String userId, String sessionId) {
        Optional<Cart> existingCart;
        
        if (userId != null && !userId.isBlank()) {
            existingCart = cartRepository.findByUserId(userId);
        } else {
            existingCart = cartRepository.findBySessionId(sessionId);
        }
        
        if (existingCart.isPresent()) {
            return existingCart.get();
        }
        
        // Create new cart
        Cart newCart = new Cart();
        newCart.setId(UUID.randomUUID().toString());
        newCart.setUserId(userId);
        newCart.setSessionId(sessionId);
        newCart.setCreatedAt(LocalDateTime.now());
        newCart.setUpdatedAt(LocalDateTime.now());
        
        return cartRepository.save(newCart);
    }
}

