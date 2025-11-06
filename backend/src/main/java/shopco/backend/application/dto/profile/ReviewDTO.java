package shopco.backend.application.dto.profile;

import java.time.LocalDateTime;

public class ReviewDTO {
    public String id;
    public String productId;
    public Integer rating;
    public String title;
    public String body;
    public LocalDateTime createdAt;
}
