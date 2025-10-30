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

  @Column(name = "orderId", nullable = false)
  private String orderId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "orderId", insertable = false, updatable = false)
  private Order order;

  @Column(name = "variantId", nullable = false)
  private String variantId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "variantId", insertable = false, updatable = false)
  private ProductVariant variant;

  @Column(name = "productName", nullable = false)
  private String productName;

  @Column(name = "variantAttributes", columnDefinition = "JSON")
  private String variantAttributes; // JSON string

  @Column(name = "unitPrice", nullable = false, precision = 12, scale = 2)
  private BigDecimal unitPrice;

  @Column(nullable = false)
  private Integer quantity;

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal subtotal;
}
