package shopco.backend.domain.entities;

import java.time.LocalDateTime;
import java.util.List;
import shopco.backend.domain.enums.ProductStatus;

public class ProductEntity {
    private String id;
    private String name;
    private String slug;
    private String description;
    private String brandId;
    private BrandEntity brand;
    private String categoryId;
    private CategoryEntity category;
    private String defaultImage;
    private String seoMetaTitle;
    private String seoMetaDesc;
    private ProductStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProductVariantEntity> variants;
    private List<ProductImageEntity> images;
    private List<ReviewEntity> reviews;
    private List<WishlistItemEntity> wishlistItems;
    private List<ProductTagEntity> tags;
    private List<CouponApplicableProductEntity> applicableCoupons;
    private List<CouponExcludedProductEntity> excludedCoupons;

    public ProductEntity(String id, String name, String slug, String description,
            String brandId, BrandEntity brand, String categoryId, CategoryEntity category,
            String defaultImage, String seoMetaTitle, String seoMetaDesc,
            ProductStatus status, LocalDateTime createdAt, LocalDateTime updatedAt,
            List<ProductVariantEntity> variants, List<ProductImageEntity> images,
            List<ReviewEntity> reviews, List<WishlistItemEntity> wishlistItems,
            List<ProductTagEntity> tags, List<CouponApplicableProductEntity> applicableCoupons,
            List<CouponExcludedProductEntity> excludedCoupons) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.brandId = brandId;
        this.brand = brand;
        this.categoryId = categoryId;
        this.category = category;
        this.defaultImage = defaultImage;
        this.seoMetaTitle = seoMetaTitle;
        this.seoMetaDesc = seoMetaDesc;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.variants = variants;
        this.images = images;
        this.reviews = reviews;
        this.wishlistItems = wishlistItems;
        this.tags = tags;
        this.applicableCoupons = applicableCoupons;
        this.excludedCoupons = excludedCoupons;
    }
    
    public ProductEntity() {
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

    public BrandEntity getBrand() {
        return brand;
    }

    public void setBrand(BrandEntity brand) {
        this.brand = brand;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public CategoryEntity getCategory() {
        return category;
    }

    public void setCategory(CategoryEntity category) {
        this.category = category;
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

    public List<ProductVariantEntity> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariantEntity> variants) {
        this.variants = variants;
    }

    public List<ProductImageEntity> getImages() {
        return images;
    }

    public void setImages(List<ProductImageEntity> images) {
        this.images = images;
    }

    public List<ReviewEntity> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewEntity> reviews) {
        this.reviews = reviews;
    }

    public List<WishlistItemEntity> getWishlistItems() {
        return wishlistItems;
    }

    public void setWishlistItems(List<WishlistItemEntity> wishlistItems) {
        this.wishlistItems = wishlistItems;
    }

    public List<ProductTagEntity> getTags() {
        return tags;
    }

    public void setTags(List<ProductTagEntity> tags) {
        this.tags = tags;
    }

    public List<CouponApplicableProductEntity> getApplicableCoupons() {
        return applicableCoupons;
    }

    public void setApplicableCoupons(List<CouponApplicableProductEntity> applicableCoupons) {
        this.applicableCoupons = applicableCoupons;
    }

    public List<CouponExcludedProductEntity> getExcludedCoupons() {
        return excludedCoupons;
    }

    public void setExcludedCoupons(List<CouponExcludedProductEntity> excludedCoupons) {
        this.excludedCoupons = excludedCoupons;
    }
}