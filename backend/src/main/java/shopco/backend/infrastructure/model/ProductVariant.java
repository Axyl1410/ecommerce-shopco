package shopco.backend.infrastructure.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_variant")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {
    
    @Id
    private String id;
    
    @Column(name = "productId", nullable = false)
    private String productId;
    
    @Column(unique = true)
    private String sku;
    
    @Column(columnDefinition = "JSON")
    private String attributes; // JSON string for variant attributes
    
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
    
    @Column(name = "salePrice", precision = 12, scale = 2)
    private BigDecimal salePrice;
    
    @Column(name = "stockQuantity", nullable = false)
    private Integer stockQuantity = 0;
    
    private Float weight;
    private String barcode;
}
