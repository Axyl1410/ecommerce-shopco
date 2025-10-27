package shopco.backend.domain.entities;

public class CouponExcludedCategoryEntity {
    private String couponId;
    private CouponEntity coupon;
    private String categoryId;
    private CategoryEntity category;

    public CouponExcludedCategoryEntity(String couponId, CouponEntity coupon,
            String categoryId, CategoryEntity category) {
        this.couponId = couponId;
        this.coupon = coupon;
        this.categoryId = categoryId;
        this.category = category;
    }
    
    public CouponExcludedCategoryEntity() {
    }

    // Getters and Setters
    public String getCouponId() {
        return couponId;
    }

    public void setCouponId(String couponId) {
        this.couponId = couponId;
    }

    public CouponEntity getCoupon() {
        return coupon;
    }

    public void setCoupon(CouponEntity coupon) {
        this.coupon = coupon;
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
}