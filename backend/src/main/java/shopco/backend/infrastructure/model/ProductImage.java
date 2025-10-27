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

  @Column(name = "product_id", nullable = false)
  private String productId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id", insertable = false, updatable = false)
  private Product product;

  @Column(name = "variant_id")
  private String variantId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "variant_id", insertable = false, updatable = false)
  private ProductVariant variant;

  @Column(nullable = false)
  private String url;

  @Column(name = "alt_text")
  private String altText;

  @Column(name = "sort_order")
  private Integer sortOrder = 0;
}
