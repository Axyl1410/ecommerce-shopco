package shopco.backend.domain.entities;

import java.time.LocalDateTime;

public class SessionEntity {
    private String id;
    private LocalDateTime expiresAt;
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String ipAddress;
    private String userAgent;
    private String userId;
    private UserEntity user;
    private String impersonatedBy;

    public SessionEntity(String id, LocalDateTime expiresAt, String token,
            LocalDateTime createdAt, LocalDateTime updatedAt, String ipAddress,
            String userAgent, String userId, UserEntity user, String impersonatedBy) {
        this.id = id;
        this.expiresAt = expiresAt;
        this.token = token;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.userId = userId;
        this.user = user;
        this.impersonatedBy = impersonatedBy;
    }
    
    public SessionEntity() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getImpersonatedBy() {
        return impersonatedBy;
    }

    public void setImpersonatedBy(String impersonatedBy) {
        this.impersonatedBy = impersonatedBy;
    }
}