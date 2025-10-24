package shopco.backend.infrastructure.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_tag")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductTag {

  @Id
  @Column(name = "product_id", nullable = false)
  private String productId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id", insertable = false, updatable = false)
  private Product product;

  @Id
  @Column(name = "tag_id", nullable = false)
  private String tagId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "tag_id", insertable = false, updatable = false)
  private Tag tag;
}
