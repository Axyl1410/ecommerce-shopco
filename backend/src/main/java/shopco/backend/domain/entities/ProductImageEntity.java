package shopco.backend.domain.entities;

public class ProductImageEntity {
    private String id;
    private String productId;
    private ProductEntity product;
    private String variantId;
    private ProductVariantEntity variant;
    private String url;
    private String altText;
    private Integer sortOrder;

    public ProductImageEntity(String id, String productId, ProductEntity product,
            String variantId, ProductVariantEntity variant, String url,
            String altText, Integer sortOrder) {
        this.id = id;
        this.productId = productId;
        this.product = product;
        this.variantId = variantId;
        this.variant = variant;
        this.url = url;
        this.altText = altText;
        this.sortOrder = sortOrder;
    }
    
    public ProductImageEntity() {
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}