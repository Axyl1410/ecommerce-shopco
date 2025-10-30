package shopco.backend.infrastructure.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import shopco.backend.domain.enums.OrderStatus;
import shopco.backend.domain.enums.PaymentStatus;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "order")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    private String id;
    
    @Column(name = "orderNo", nullable = false, unique = true)
    private String orderNo;
    
    @Column(name = "userId", nullable = false)
    private String userId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", insertable = false, updatable = false)
    private User user;
    
    @Column(name = "totalAmount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "shippingFee", nullable = false, precision = 12, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;
    
    @Column(name = "discountAmount", nullable = false, precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "finalAmount", nullable = false, precision = 12, scale = 2)
    private BigDecimal finalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payStatus", nullable = false)
    private PaymentStatus payStatus = PaymentStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "orderStatus", nullable = false)
    private OrderStatus orderStatus = OrderStatus.PENDING;
    
    @Column(name = "paymentMethod")
    private String paymentMethod;
    
    @Column(name = "shippingAddress", columnDefinition = "JSON")
    private String shippingAddress; // JSON string
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "adminNotes", columnDefinition = "TEXT")
    private String adminNotes;
    
    @Column(name = "trackingNumber")
    private String trackingNumber;
    
    @CreationTimestamp
    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderStatusHistory> statusHistory;
    
    // --- MỚI: Thêm liên kết Coupon ---
    @Column(name = "couponId")
    private String couponId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couponId", insertable = false, updatable = false)
    private Coupon coupon;
    
    // --- CẬP NHẬT: Thêm trường để lưu mã coupon đã áp dụng ---
    // (Rất quan trọng để tra cứu sau này, ngay cả khi coupon gốc bị thay đổi/xóa)
    @Column(name = "appliedCouponCode")
    private String appliedCouponCode;
}

