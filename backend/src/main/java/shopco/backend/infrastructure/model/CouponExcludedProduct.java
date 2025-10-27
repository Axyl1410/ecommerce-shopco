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
@Table(name = "coupon_excluded_product")
@IdClass(CouponExcludedProduct.CouponExcludedProductId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponExcludedProduct {

  @Id
  @Column(name = "coupon_id", nullable = false)
  private String couponId;

  @Id
  @Column(name = "product_id", nullable = false)
  private String productId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "coupon_id", insertable = false, updatable = false)
  private Coupon coupon;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id", insertable = false, updatable = false)
  private Product product;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class CouponExcludedProductId implements Serializable {
    private String couponId;
    private String productId;
  }
}