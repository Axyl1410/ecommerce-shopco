package shopco.backend.domain.entities;

import java.math.BigDecimal;
import java.util.List;

public class ProductVariantEntity {
    private String id;
    private String productId;
    private ProductEntity product;
    private String sku;
    private String attributes;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Float weight;
    private String barcode;
    private List<ProductImageEntity> images;
    private List<CartItemEntity> cartItems;
    private List<OrderItemEntity> orderItems;

    public ProductVariantEntity(String id, String productId, ProductEntity product,
            String sku, String attributes, BigDecimal price, BigDecimal salePrice,
            Integer stockQuantity, Float weight, String barcode,
            List<ProductImageEntity> images, List<CartItemEntity> cartItems,
            List<OrderItemEntity> orderItems) {
        this.id = id;
        this.productId = productId;
        this.product = product;
        this.sku = sku;
        this.attributes = attributes;
        this.price = price;
        this.salePrice = salePrice;
        this.stockQuantity = stockQuantity;
        this.weight = weight;
        this.barcode = barcode;
        this.images = images;
        this.cartItems = cartItems;
        this.orderItems = orderItems;
    }
    
    public ProductVariantEntity() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public ProductEntity getProduct() {
        return product;
    }

    public void setProduct(ProductEntity product) {
        this.product = product;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getAttributes() {
        return attributes;
    }

    public void setAttributes(String attributes) {
        this.attributes = attributes;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Float getWeight() {
        return weight;
    }

    public void setWeight(Float weight) {
        this.weight = weight;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public List<ProductImageEntity> getImages() {
        return images;
    }

    public void setImages(List<ProductImageEntity> images) {
        this.images = images;
    }

    public List<CartItemEntity> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItemEntity> cartItems) {
        this.cartItems = cartItems;
    }

    public List<OrderItemEntity> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemEntity> orderItems) {
        this.orderItems = orderItems;
    }
}