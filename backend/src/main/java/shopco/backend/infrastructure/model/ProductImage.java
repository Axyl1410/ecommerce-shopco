package shopco.backend.infrastructure.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImage {

  @Id private String id;

  @Column(name = "productId", nullable = false)
  private String productId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "productId", insertable = false, updatable = false)
  private Product product;

  @Column(name = "variantId")
  private String variantId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "variantId", insertable = false, updatable = false)
  private ProductVariant variant;

  @Column(nullable = false)
  private String url;

  @Column(name = "altText")
  private String altText;

  @Column(name = "sortOrder")
  private Integer sortOrder = 0;
}
