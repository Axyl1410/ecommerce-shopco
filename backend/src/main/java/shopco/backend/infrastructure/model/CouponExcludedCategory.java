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
@Table(name = "coupon_excluded_category")
@IdClass(CouponExcludedCategory.CouponExcludedCategoryId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponExcludedCategory {

  @Id
  @Column(name = "couponId", nullable = false)
  private String couponId;

  @Id
  @Column(name = "categoryId", nullable = false)
  private String categoryId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "couponId", insertable = false, updatable = false)
  private Coupon coupon;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "categoryId", insertable = false, updatable = false)
  private Category category;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class CouponExcludedCategoryId implements Serializable {
    private String couponId;
    private String categoryId;
  }
}
