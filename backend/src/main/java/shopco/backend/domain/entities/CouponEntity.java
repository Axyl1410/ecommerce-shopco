package shopco.backend.domain.entities;

import shopco.backend.domain.enums.CouponType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CouponEntity {
    private String id;
    private String code;
    private CouponType type;
    private BigDecimal value;
    private String description;
    private BigDecimal minOrderAmount;
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
    private Integer usageLimit;
    private Integer usedCount;
    private Integer usageLimitPerUser;
    private Boolean active;
    private LocalDateTime createdAt;
    private List<CouponApplicableProductEntity> applicableProducts;
    private List<CouponApplicableCategoryEntity> applicableCategories;
    private List<CouponExcludedProductEntity> excludedProducts;
    private List<CouponExcludedCategoryEntity> excludedCategories;
    private List<OrderEntity> orders;

    public CouponEntity(String id, String code, CouponType type, BigDecimal value,
            String description, BigDecimal minOrderAmount, LocalDateTime startsAt,
            LocalDateTime endsAt, Integer usageLimit, Integer usedCount,
            Integer usageLimitPerUser, Boolean active, LocalDateTime createdAt,
            List<CouponApplicableProductEntity> applicableProducts,
            List<CouponApplicableCategoryEntity> applicableCategories,
            List<CouponExcludedProductEntity> excludedProducts,
            List<CouponExcludedCategoryEntity> excludedCategories,
            List<OrderEntity> orders) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.value = value;
        this.description = description;
        this.minOrderAmount = minOrderAmount;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.usageLimit = usageLimit;
        this.usedCount = usedCount;
        this.usageLimitPerUser = usageLimitPerUser;
        this.active = active;
        this.createdAt = createdAt;
        this.applicableProducts = applicableProducts;
        this.applicableCategories = applicableCategories;
        this.excludedProducts = excludedProducts;
        this.excludedCategories = excludedCategories;
        this.orders = orders;
    }
    
    public CouponEntity() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CouponType getType() {
        return type;
    }

    public void setType(CouponType type) {
        this.type = type;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getMinOrderAmount() {
        return minOrderAmount;
    }

    public void setMinOrderAmount(BigDecimal minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }

    public LocalDateTime getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(LocalDateTime startsAt) {
        this.startsAt = startsAt;
    }

    public LocalDateTime getEndsAt() {
        return endsAt;
    }

    public void setEndsAt(LocalDateTime endsAt) {
        this.endsAt = endsAt;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public Integer getUsedCount() {
        return usedCount;
    }

    public void setUsedCount(Integer usedCount) {
        this.usedCount = usedCount;
    }

    public Integer getUsageLimitPerUser() {
        return usageLimitPerUser;
    }

    public void setUsageLimitPerUser(Integer usageLimitPerUser) {
        this.usageLimitPerUser = usageLimitPerUser;
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

    public List<CouponApplicableProductEntity> getApplicableProducts() {
        return applicableProducts;
    }

    public void setApplicableProducts(List<CouponApplicableProductEntity> applicableProducts) {
        this.applicableProducts = applicableProducts;
    }

    public List<CouponApplicableCategoryEntity> getApplicableCategories() {
        return applicableCategories;
    }

    public void setApplicableCategories(List<CouponApplicableCategoryEntity> applicableCategories) {
        this.applicableCategories = applicableCategories;
    }

    public List<CouponExcludedProductEntity> getExcludedProducts() {
        return excludedProducts;
    }

    public void setExcludedProducts(List<CouponExcludedProductEntity> excludedProducts) {
        this.excludedProducts = excludedProducts;
    }

    public List<CouponExcludedCategoryEntity> getExcludedCategories() {
        return excludedCategories;
    }

    public void setExcludedCategories(List<CouponExcludedCategoryEntity> excludedCategories) {
        this.excludedCategories = excludedCategories;
    }

    public List<OrderEntity> getOrders() {
        return orders;
    }

    public void setOrders(List<OrderEntity> orders) {
        this.orders = orders;
    }
}