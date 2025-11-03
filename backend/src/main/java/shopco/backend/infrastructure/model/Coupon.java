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
    @Column(name = "minOrderAmount", precision = 12, scale = 2)
    private BigDecimal minOrderAmount;
    
    @Column(name = "startsAt", nullable = false)
    private LocalDateTime startsAt;
    
    @Column(name = "endsAt", nullable = false)
    private LocalDateTime endsAt;
    
    // 2. Giới hạn sử dụng
    @Column(name = "usageLimit")
    private Integer usageLimit;
    
    @Column(name = "usedCount", nullable = false)
    private Integer usedCount = 0;
    
    @Column(name = "usageLimitPerUser")
    private Integer usageLimitPerUser = 1;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @CreationTimestamp
    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
