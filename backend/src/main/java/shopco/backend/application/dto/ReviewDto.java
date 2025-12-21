package shopco.backend.application.dto;

import java.time.LocalDateTime;

public class ReviewDto {
    private String id;
    private String productId;
    private Integer rating;
    private String title;
    private String body;
    private LocalDateTime createdAt;

    public ReviewDto() {}

    public ReviewDto(String id, String productId, Integer rating, String title, String body, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.rating = rating;
        this.title = title;
        this.body = body;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}