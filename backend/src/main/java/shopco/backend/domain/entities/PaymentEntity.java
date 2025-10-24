package shopco.backend.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentEntity {
    private String id;
    private String orderId;
    private OrderEntity order;
    private String provider;
    private String status;
    private BigDecimal amount;
    private String providerTxnId;
    private String metadata;
    private LocalDateTime createdAt;

    public PaymentEntity(String id, String orderId, OrderEntity order, String provider,
            String status, BigDecimal amount, String providerTxnId, String metadata,
            LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.order = order;
        this.provider = provider;
        this.status = status;
        this.amount = amount;
        this.providerTxnId = providerTxnId;
        this.metadata = metadata;
        this.createdAt = createdAt;
    }
    
    public PaymentEntity() {
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

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getProviderTxnId() {
        return providerTxnId;
    }

    public void setProviderTxnId(String providerTxnId) {
        this.providerTxnId = providerTxnId;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}