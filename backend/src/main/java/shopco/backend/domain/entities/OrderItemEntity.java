package shopco.backend.domain.entities;

import java.math.BigDecimal;

public class OrderItemEntity {
    private String id;
    private String orderId;
    private OrderEntity order;
    private String variantId;
    private ProductVariantEntity variant;
    private String productName;
    private String variantAttributes;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;

    public OrderItemEntity(String id, String orderId, OrderEntity order, String variantId,
            ProductVariantEntity variant, String productName, String variantAttributes,
            BigDecimal unitPrice, Integer quantity, BigDecimal subtotal) {
        this.id = id;
        this.orderId = orderId;
        this.order = order;
        this.variantId = variantId;
        this.variant = variant;
        this.productName = productName;
        this.variantAttributes = variantAttributes;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }
    
    public OrderItemEntity() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public OrderEntity getOrder() {
        return order;
    }

    public void setOrder(OrderEntity order) {
        this.order = order;
    }

    public String getVariantId() {
        return variantId;
    }

    public void setVariantId(String variantId) {
        this.variantId = variantId;
    }

    public ProductVariantEntity getVariant() {
        return variant;
    }

    public void setVariant(ProductVariantEntity variant) {
        this.variant = variant;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getVariantAttributes() {
        return variantAttributes;
    }

    public void setVariantAttributes(String variantAttributes) {
        this.variantAttributes = variantAttributes;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}