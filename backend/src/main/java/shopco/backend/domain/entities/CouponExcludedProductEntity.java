package shopco.backend.domain.entities;

public class CouponExcludedProductEntity {
    private String couponId;
    private CouponEntity coupon;
    private String productId;
    private ProductEntity product;

    public CouponExcludedProductEntity(String couponId, CouponEntity coupon,
            String productId, ProductEntity product) {
        this.couponId = couponId;
        this.coupon = coupon;
        this.productId = productId;
        this.product = product;
    }
    
    public CouponExcludedProductEntity() {
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
}