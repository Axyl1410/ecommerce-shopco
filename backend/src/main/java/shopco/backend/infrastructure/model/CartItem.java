package shopco.backend.infrastructure.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "cart_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    
    @Id
    private String id;
    
    @Column(name = "cartId", nullable = false)
    private String cartId;
    
    @Column(name = "variantId", nullable = false)
    private String variantId;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(name = "priceAtAdd", nullable = false, precision = 12, scale = 2)
    private BigDecimal priceAtAdd;
    
    @CreationTimestamp
    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
