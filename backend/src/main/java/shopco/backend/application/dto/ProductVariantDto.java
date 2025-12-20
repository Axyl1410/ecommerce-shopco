package shopco.backend.application.dto;

import java.math.BigDecimal;

public class ProductVariantDto {
    private String id;
    private String sku;
    private String attributes; // JSON string
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Float weight;
    private String barcode;

    public ProductVariantDto() {}

    public ProductVariantDto(String id, String sku, String attributes, BigDecimal price,
                           BigDecimal salePrice, Integer stockQuantity, Float weight, String barcode) {
        this.id = id;
        this.sku = sku;
        this.attributes = attributes;
        this.price = price;
        this.salePrice = salePrice;
        this.stockQuantity = stockQuantity;
        this.weight = weight;
        this.barcode = barcode;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getAttributes() { return attributes; }
    public void setAttributes(String attributes) { this.attributes = attributes; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Float getWeight() { return weight; }
    public void setWeight(Float weight) { this.weight = weight; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }
}