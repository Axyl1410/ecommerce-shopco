package shopco.backend.application.dto.profile;

import java.time.LocalDateTime;

public class UserProfileDTO {
    public String id;
    public String name;
    public String email;
    public String image;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public UserProfileDTO() {}

    public UserProfileDTO(String id, String name, String email, String image,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
