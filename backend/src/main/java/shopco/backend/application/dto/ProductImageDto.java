package shopco.backend.application.dto;

public class ProductImageDto {
    private String id;
    private String variantId;
    private String url;
    private String altText;
    private Integer sortOrder;

    public ProductImageDto() {}

    public ProductImageDto(String id, String variantId, String url, String altText, Integer sortOrder) {
        this.id = id;
        this.variantId = variantId;
        this.url = url;
        this.altText = altText;
        this.sortOrder = sortOrder;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVariantId() { return variantId; }
    public void setVariantId(String variantId) { this.variantId = variantId; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}