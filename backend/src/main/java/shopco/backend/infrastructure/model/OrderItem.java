package shopco.backend.infrastructure.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

  @Id private String id;

  @Column(name = "order_id", nullable = false)
  private String orderId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id", insertable = false, updatable = false)
  private Order order;

  @Column(name = "variant_id", nullable = false)
  private String variantId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "variant_id", insertable = false, updatable = false)
  private ProductVariant variant;

  @Column(name = "product_name", nullable = false)
  private String productName;

  @Column(name = "variant_attributes", columnDefinition = "JSON")
  private String variantAttributes; // JSON string

  @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
  private BigDecimal unitPrice;

  @Column(nullable = false)
  private Integer quantity;

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal subtotal;
}
