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
@Table(name = "product_tag")
@IdClass(ProductTag.ProductTagId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductTag {

  @Id
  @Column(name = "productId", nullable = false)
  private String productId;

  @Id
  @Column(name = "tagId", nullable = false)
  private String tagId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "productId", insertable = false, updatable = false)
  private Product product;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "tagId", insertable = false, updatable = false)
  private Tag tag;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ProductTagId implements Serializable {
    private String productId;
    private String tagId;
  }
}
