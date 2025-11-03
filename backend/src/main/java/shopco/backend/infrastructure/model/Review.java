package shopco.backend.infrastructure.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import shopco.backend.domain.enums.ReviewStatus;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "review")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

  @Id private String id;

  @Column(name = "productId", nullable = false)
  private String productId;

  @Column(name = "userId", nullable = false)
  private String userId;

  @Column(name = "orderItemId", unique = true)
  private String orderItemId;

  @Column(nullable = false)
  private Integer rating; // 1-5 stars

  private String title;

  @Column(columnDefinition = "TEXT")
  private String body;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ReviewStatus status = ReviewStatus.PENDING;

  @CreationTimestamp
  @Column(name = "createdAt", nullable = false, updatable = false)
  private LocalDateTime createdAt;
}
