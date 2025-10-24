package shopco.backend.domain.entities;

import java.time.LocalDateTime;
import shopco.backend.domain.enums.OrderStatus;

public class OrderStatusHistoryEntity {
    private String id;
    private String orderId;
    private OrderEntity order;
    private OrderStatus status;
    private String notes;
    private String changedBy;
    private LocalDateTime createdAt;

    public OrderStatusHistoryEntity(String id, String orderId, OrderEntity order,
            OrderStatus status, String notes, String changedBy, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.order = order;
        this.status = status;
        this.notes = notes;
        this.changedBy = changedBy;
        this.createdAt = createdAt;
    }
    
    public OrderStatusHistoryEntity() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public OrderEntity getOrder() {
        return order;
    }

    public void setOrder(OrderEntity order) {
        this.order = order;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}