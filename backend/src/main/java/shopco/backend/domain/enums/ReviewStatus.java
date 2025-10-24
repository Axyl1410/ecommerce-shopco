package shopco.backend.domain.enums;

/**
 * Review status enumeration
 * Represents the moderation status of a product review
 */
public enum ReviewStatus {
    /**
     * Review is pending moderation
     */
    PENDING,
    
    /**
     * Review has been approved and is visible
     */
    APPROVED,
    
    /**
     * Review has been rejected and is not visible
     */
    REJECTED
}
