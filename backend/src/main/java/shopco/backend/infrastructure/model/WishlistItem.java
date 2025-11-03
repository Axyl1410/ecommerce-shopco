package shopco.backend.infrastructure.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "wishlist_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItem {
    
    @Id
    private String id;
    
    @Column(name = "userId", nullable = false)
    private String userId;
    
    @Column(name = "productId", nullable = false)
    private String productId;
    
    @CreationTimestamp
    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
