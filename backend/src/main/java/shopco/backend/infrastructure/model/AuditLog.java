package shopco.backend.infrastructure.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "audit_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

  @Id private String id;

  @Column(name = "user_id")
  private String userId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", insertable = false, updatable = false)
  private User user;

  @Column(nullable = false)
  private String action;

  @Column(nullable = false)
  private String entity;

  @Column(name = "entity_id")
  private String entityId;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String message;

  @Column(columnDefinition = "JSON")
  private String metadata; // JSON string

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;
}
