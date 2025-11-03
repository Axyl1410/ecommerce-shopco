package shopco.backend.infrastructure.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "session")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {

  @Id private String id;

  @Column(name = "expiresAt", nullable = false)
  private LocalDateTime expiresAt;

  @Column(nullable = false, unique = true)
  private String token;

  @CreationTimestamp
  @Column(name = "createdAt", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updatedAt", nullable = false)
  private LocalDateTime updatedAt;

  @Column(name = "ipAddress")
  private String ipAddress;

  @Column(name = "userAgent")
  private String userAgent;

  @Column(name = "userId", nullable = false)
  private String userId;

  @Column(name = "impersonatedBy")
  private String impersonatedBy;
}
