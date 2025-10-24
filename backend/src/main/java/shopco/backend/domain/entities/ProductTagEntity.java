package shopco.backend.domain.entities;

public class ProductTagEntity {
    private String productId;
    private ProductEntity product;
    private String tagId;
    private TagEntity tag;

    public ProductTagEntity(String productId, ProductEntity product,
            String tagId, TagEntity tag) {
        this.productId = productId;
        this.product = product;
        this.tagId = tagId;
        this.tag = tag;
    }
    
    public ProductTagEntity() {
    }

    // Getters and Setters
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

    public String getTagId() {
        return tagId;
    }

    public void setTagId(String tagId) {
        this.tagId = tagId;
    }

    public TagEntity getTag() {
        return tag;
    }

    public void setTag(TagEntity tag) {
        this.tag = tag;
    }
}