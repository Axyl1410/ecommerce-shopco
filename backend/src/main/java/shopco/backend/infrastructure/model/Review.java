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

  @Column(name = "product_id", nullable = false)
  private String productId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id", insertable = false, updatable = false)
  private Product product;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", insertable = false, updatable = false)
  private User user;

  @Column(name = "order_item_id", unique = true)
  private String orderItemId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_item_id", insertable = false, updatable = false)
  private OrderItem orderItem;

  @Column(nullable = false)
  private Integer rating; // 1-5 stars

  private String title;

  @Column(columnDefinition = "TEXT")
  private String body;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ReviewStatus status = ReviewStatus.PENDING;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;
}
