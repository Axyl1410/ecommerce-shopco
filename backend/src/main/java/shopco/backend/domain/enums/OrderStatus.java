package shopco.backend.domain.enums;

/**
 * Order status enumeration
 * Represents the current status of an order in the fulfillment process
 */
public enum OrderStatus {
    /**
     * Order is pending - waiting for payment or confirmation
     */
    PENDING,
    
    /**
     * Order has been confirmed - payment received or COD confirmed
     */
    CONFIRMED,
    
    /**
     * Order is being processed - items being prepared for shipment
     */
    PROCESSING,
    
    /**
     * Order has been shipped - items are in transit
     */
    SHIPPED,
    
    /**
     * Order has been delivered successfully
     */
    DELIVERED,
    
    /**
     * Order has been cancelled
     */
    CANCELLED,
    
    /**
     * Customer has requested to return the order
     */
    RETURNED,
    
    /**
     * Order has been refunded
     */
    REFUNDED
}
