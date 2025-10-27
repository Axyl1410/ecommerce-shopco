package shopco.backend.infrastructure.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coupon_applicable_category")
@IdClass(CouponApplicableCategory.CouponApplicableCategoryId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponApplicableCategory {

  @Id
  @Column(name = "coupon_id", nullable = false)
  private String couponId;

  @Id
  @Column(name = "category_id", nullable = false)
  private String categoryId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "coupon_id", insertable = false, updatable = false)
  private Coupon coupon;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id", insertable = false, updatable = false)
  private Category category;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class CouponApplicableCategoryId implements Serializable {
    private String couponId;
    private String categoryId;
  }
}
