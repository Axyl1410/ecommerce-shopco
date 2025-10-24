package shopco.backend.domain.enums;

/**
 * Product status enumeration
 * Represents the current status of a product in the system
 */
public enum ProductStatus {
    /**
     * Product is in draft state - not visible to customers
     */
    DRAFT,
    
    /**
     * Product is published and visible to customers
     */
    PUBLISHED,
    
    /**
     * Product is archived - hidden from customers but preserved
     */
    ARCHIVED
}
