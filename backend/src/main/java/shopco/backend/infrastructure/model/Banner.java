package shopco.backend.infrastructure.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "banner")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Banner {
    
    @Id
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "imageUrl", nullable = false)
    private String imageUrl;
    
    @Column(name = "linkUrl")
    private String linkUrl;
    
    @Column(nullable = false)
    private String position;
    
    @Column(name = "sortOrder", nullable = false)
    private Integer sortOrder = 0;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @CreationTimestamp
    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;
}
