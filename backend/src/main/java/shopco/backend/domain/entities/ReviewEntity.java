package shopco.backend.domain.entities;

import java.time.LocalDateTime;
import shopco.backend.domain.enums.ReviewStatus;

public class ReviewEntity {
    private String id;
    private String productId;
    private ProductEntity product;
    private String userId;
    private UserEntity user;
    private String orderItemId;
    private OrderItemEntity orderItem;
    private Integer rating;
    private String title;
    private String body;
    private ReviewStatus status;
    private LocalDateTime createdAt;

    public ReviewEntity(String id, String productId, ProductEntity product,
            String userId, UserEntity user, String orderItemId, OrderItemEntity orderItem,
            Integer rating, String title, String body, ReviewStatus status,
            LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.product = product;
        this.userId = userId;
        this.user = user;
        this.orderItemId = orderItemId;
        this.orderItem = orderItem;
        this.rating = rating;
        this.title = title;
        this.body = body;
        this.status = status;
        this.createdAt = createdAt;
    }
    
    public ReviewEntity() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public ProductEntity getProduct() {
        return product;
    }

    public void setProduct(ProductEntity product) {
        this.product = product;
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

    public String getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(String orderItemId) {
        this.orderItemId = orderItemId;
    }

    public OrderItemEntity getOrderItem() {
        return orderItem;
    }

    public void setOrderItem(OrderItemEntity orderItem) {
        this.orderItem = orderItem;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public ReviewStatus getStatus() {
        return status;
    }

    public void setStatus(ReviewStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}