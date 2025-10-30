package shopco.backend.domain.entities;

import java.time.LocalDateTime;

public class UserEntity {
    private String id;
    private String name;
    private String email;
    private Boolean emailVerified;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Better Auth fields (optional per schema)
    private String role;        // nullable
    private Boolean banned;     // default false
    private String banReason;   // nullable
    private LocalDateTime banExpires; // nullable

    public UserEntity(String id, String name, String email, Boolean emailVerified,
            String image, LocalDateTime createdAt, LocalDateTime updatedAt,
            String role, Boolean banned, String banReason, LocalDateTime banExpires) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.emailVerified = emailVerified;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.role = role;
        this.banned = banned;
        this.banReason = banReason;
        this.banExpires = banExpires;
    }

    public UserEntity() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getBanned() { return banned; }
    public void setBanned(Boolean banned) { this.banned = banned; }

    public String getBanReason() { return banReason; }
    public void setBanReason(String banReason) { this.banReason = banReason; }

    public LocalDateTime getBanExpires() { return banExpires; }
    public void setBanExpires(LocalDateTime banExpires) { this.banExpires = banExpires; }
}