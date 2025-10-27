package shopco.backend.infrastructure.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "account")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    
    @Id
    private String id;
    
    @Column(name = "account_id", nullable = false)
    private String accountId;
    
    @Column(name = "provider_id", nullable = false)
    private String providerId;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @Column(name = "access_token")
    private String accessToken;
    
    @Column(name = "refresh_token")
    private String refreshToken;
    
    @Column(name = "id_token")
    private String idToken;
    
    @Column(name = "access_token_expires_at")
    private LocalDateTime accessTokenExpiresAt;
    
    @Column(name = "refresh_token_expires_at")
    private LocalDateTime refreshTokenExpiresAt;
    
    private String scope;
    private String password;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
