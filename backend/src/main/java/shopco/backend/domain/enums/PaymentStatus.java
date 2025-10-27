package shopco.backend.domain.enums;

/**
 * Payment status enumeration
 * Represents the current status of a payment transaction
 */
public enum PaymentStatus {
    /**
     * Payment is pending - waiting for processing
     */
    PENDING,
    
    /**
     * Payment has been successfully completed
     */
    PAID,
    
    /**
     * Payment has failed
     */
    FAILED,
    
    /**
     * Payment has been fully refunded
     */
    REFUNDED,
    
    /**
     * Payment has been partially refunded
     */
    PARTIALLY_REFUNDED
}
