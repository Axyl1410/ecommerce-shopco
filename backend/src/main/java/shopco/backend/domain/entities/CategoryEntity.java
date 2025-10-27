package shopco.backend.domain.entities;

import java.time.LocalDateTime;
import java.util.List;

public class CategoryEntity {
    private String id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private String parentId;
    private CategoryEntity parent;
    private List<CategoryEntity> children;
    private Integer sortOrder;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProductEntity> products;
    private List<CouponApplicableCategoryEntity> applicableCoupons;
    private List<CouponExcludedCategoryEntity> excludedCoupons;

    public CategoryEntity(String id, String name, String slug, String description, 
            String imageUrl, String parentId, CategoryEntity parent, List<CategoryEntity> children,
            Integer sortOrder, Boolean active, LocalDateTime createdAt, LocalDateTime updatedAt,
            List<ProductEntity> products, List<CouponApplicableCategoryEntity> applicableCoupons,
            List<CouponExcludedCategoryEntity> excludedCoupons) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.imageUrl = imageUrl;
        this.parentId = parentId;
        this.parent = parent;
        this.children = children;
        this.sortOrder = sortOrder;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.products = products;
        this.applicableCoupons = applicableCoupons;
        this.excludedCoupons = excludedCoupons;
    }
    
    public CategoryEntity() {
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public CategoryEntity getParent() {
        return parent;
    }

    public void setParent(CategoryEntity parent) {
        this.parent = parent;
    }

    public List<CategoryEntity> getChildren() {
        return children;
    }

    public void setChildren(List<CategoryEntity> children) {
        this.children = children;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
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

    public List<ProductEntity> getProducts() {
        return products;
    }

    public void setProducts(List<ProductEntity> products) {
        this.products = products;
    }

    public List<CouponApplicableCategoryEntity> getApplicableCoupons() {
        return applicableCoupons;
    }

    public void setApplicableCoupons(List<CouponApplicableCategoryEntity> applicableCoupons) {
        this.applicableCoupons = applicableCoupons;
    }

    public List<CouponExcludedCategoryEntity> getExcludedCoupons() {
        return excludedCoupons;
    }

    public void setExcludedCoupons(List<CouponExcludedCategoryEntity> excludedCoupons) {
        this.excludedCoupons = excludedCoupons;
    }
}