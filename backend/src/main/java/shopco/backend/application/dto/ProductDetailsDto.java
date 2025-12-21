package shopco.backend.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductDetailsDto {

    private String id;
    private String name;
    private String slug;
    private String description;
    private String brandId;
    private String brandName;
    private String categoryId;
    private String categoryName;
    private String defaultImage;
    private String seoMetaTitle;
    private String seoMetaDesc;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProductVariantDto> variants;
    private List<ProductImageDto> images;
    private List<ReviewDto> reviews;
    private List<String> tags;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String stockStatus;

    public ProductDetailsDto() {
    }

    public ProductDetailsDto(String id, String name, String slug, String description,
            String brandId, String brandName, String categoryId, String categoryName,
            String defaultImage, String seoMetaTitle, String seoMetaDesc,
            String status, LocalDateTime createdAt, LocalDateTime updatedAt,
            List<ProductVariantDto> variants, List<ProductImageDto> images,
            List<ReviewDto> reviews, List<String> tags,
            BigDecimal minPrice, BigDecimal maxPrice, String stockStatus) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.brandId = brandId;
        this.brandName = brandName;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.defaultImage = defaultImage;
        this.seoMetaTitle = seoMetaTitle;
        this.seoMetaDesc = seoMetaDesc;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.variants = variants;
        this.images = images;
        this.reviews = reviews;
        this.tags = tags;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.stockStatus = stockStatus;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ProductVariantDto> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariantDto> variants) {
        this.variants = variants;
    }

    public List<ProductImageDto> getImages() {
        return images;
    }

    public void setImages(List<ProductImageDto> images) {
        this.images = images;
    }

    public List<ReviewDto> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewDto> reviews) {
        this.reviews = reviews;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(String stockStatus) {
        this.stockStatus = stockStatus;
    }
}