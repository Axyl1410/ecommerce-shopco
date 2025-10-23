package shopco.backend.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CartItemEntity {
    private String id;
    private String cartId;
    private String variantId;
    private Integer quantity;
    private BigDecimal priceAtAdd;
    private LocalDateTime createdAt;

    public CartItemEntity(String id, String cartId, String variantId,
            Integer quantity, BigDecimal priceAtAdd, LocalDateTime createdAt) {
        this.id = id;
        this.cartId = cartId;
        this.variantId = variantId;
        this.quantity = quantity;
        this.priceAtAdd = priceAtAdd;
        this.createdAt = createdAt;
    }
    
    public CartItemEntity() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCartId() {
        return cartId;
    }

    public void setCartId(String cartId) {
        this.cartId = cartId;
    }

    public String getVariantId() {
        return variantId;
    }

    public void setVariantId(String variantId) {
        this.variantId = variantId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceAtAdd() {
        return priceAtAdd;
    }

    public void setPriceAtAdd(BigDecimal priceAtAdd) {
        this.priceAtAdd = priceAtAdd;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}