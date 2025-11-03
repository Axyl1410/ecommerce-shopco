package shopco.backend.application.use_cases;

import shopco.backend.application.dto.CartItemResponse;
import shopco.backend.application.dto.CartResponse;
import shopco.backend.infrastructure.model.Cart;
import shopco.backend.infrastructure.model.CartItem;
import shopco.backend.infrastructure.model.Product;
import shopco.backend.infrastructure.model.ProductVariant;
import shopco.backend.infrastructure.repository.CartRepository;
import shopco.backend.infrastructure.repository.CartItemRepository;
import shopco.backend.infrastructure.repository.ProductRepository;
import shopco.backend.infrastructure.repository.ProductVariantRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class CartResponseBuilder {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    
    public CartResponseBuilder(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductVariantRepository productVariantRepository,
            ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.productRepository = productRepository;
    }
    
    public CartResponse build(String cartId) {
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        List<CartItem> items = cartItemRepository.findByCartId(cartId);
        
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
    
    private CartItemResponse toCartItemResponse(CartItem item) {
        BigDecimal subtotal = item.getPriceAtAdd().multiply(new BigDecimal(item.getQuantity()));
        
        // Fetch variant and product information
        ProductVariant variant = productVariantRepository.findById(item.getVariantId())
            .orElse(null);
        
        String productName = "Product Name";
        String sku = "SKU-" + item.getVariantId();
        String attributes = "{}";
        
        if (variant != null) {
            sku = variant.getSku() != null ? variant.getSku() : sku;
            attributes = variant.getAttributes() != null ? variant.getAttributes() : attributes;
            
            // Fetch product name
            Product product = productRepository.findById(variant.getProductId())
                .orElse(null);
            if (product != null) {
                productName = product.getName();
            }
        }
        
        return new CartItemResponse(
            item.getId(),
            item.getCartId(),
            item.getVariantId(),
            productName,
            sku,
            attributes,
            item.getQuantity(),
            item.getPriceAtAdd(),
            subtotal,
            item.getCreatedAt()
        );
    }
}

