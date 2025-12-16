package shopco.backend.application.dto.admin;

import java.util.List;
import shopco.backend.domain.enums.ProductStatus;

/**
 * Request DTO for updating an existing product
 */
public class UpdateProductRequest {
    private String name;
    private String slug;
    private String description;
    private String brandId;
    private String categoryId;
    private String defaultImage;
    private String seoMetaTitle;
    private String seoMetaDesc;
    private ProductStatus status;
    private List<String> tagIds;

    public UpdateProductRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBrandId() {
        return brandId;
    }

    public void setBrandId(String brandId) {
        this.brandId = brandId;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getDefaultImage() {
        return defaultImage;
    }

    public void setDefaultImage(String defaultImage) {
        this.defaultImage = defaultImage;
    }

    public String getSeoMetaTitle() {
        return seoMetaTitle;
    }

    public void setSeoMetaTitle(String seoMetaTitle) {
        this.seoMetaTitle = seoMetaTitle;
    }

    public String getSeoMetaDesc() {
        return seoMetaDesc;
    }

    public void setSeoMetaDesc(String seoMetaDesc) {
        this.seoMetaDesc = seoMetaDesc;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public List<String> getTagIds() {
        return tagIds;
    }

    public void setTagIds(List<String> tagIds) {
        this.tagIds = tagIds;
    }
}
