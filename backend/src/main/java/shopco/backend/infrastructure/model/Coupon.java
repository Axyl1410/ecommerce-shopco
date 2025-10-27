package shopco.backend.infrastructure.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import shopco.backend.domain.enums.CouponType;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "coupon")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {
    
    @Id
    private String id;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CouponType type;
    
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal value;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // 1. Điều kiện sử dụng
    @Column(name = "min_order_amount", precision = 12, scale = 2)
    private BigDecimal minOrderAmount;
    
    @Column(name = "starts_at", nullable = false)
    private LocalDateTime startsAt;
    
    @Column(name = "ends_at", nullable = false)
    private LocalDateTime endsAt;
    
    // 2. Giới hạn sử dụng
    @Column(name = "usage_limit")
    private Integer usageLimit;
    
    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0;
    
    @Column(name = "usage_limit_per_user")
    private Integer usageLimitPerUser = 1;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // --- MỚI: Giới hạn phạm vi áp dụng ---
    
    // 3. Phạm vi áp dụng (Nếu cả 4 mảng này đều rỗng, nghĩa là áp dụng cho TOÀN BỘ ĐƠN HÀNG)
    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CouponApplicableProduct> applicableProducts;
    
    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CouponApplicableCategory> applicableCategories;
    
    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CouponExcludedProduct> excludedProducts;
    
    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CouponExcludedCategory> excludedCategories;
    
    // 4. Liên kết với các đơn hàng đã sử dụng (Để theo dõi)
    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders;
}
