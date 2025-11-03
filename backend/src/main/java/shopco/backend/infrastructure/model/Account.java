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
    
    @Column(name = "accountId", nullable = false)
    private String accountId;
    
    @Column(name = "providerId", nullable = false)
    private String providerId;
    
    @Column(name = "userId", nullable = false)
    private String userId;
    
    @Column(name = "accessToken")
    private String accessToken;
    
    @Column(name = "refreshToken")
    private String refreshToken;
    
    @Column(name = "idToken")
    private String idToken;
    
    @Column(name = "accessTokenExpiresAt")
    private LocalDateTime accessTokenExpiresAt;
    
    @Column(name = "refreshTokenExpiresAt")
    private LocalDateTime refreshTokenExpiresAt;
    
    private String scope;
    private String password;
    
    @CreationTimestamp
    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;
}
