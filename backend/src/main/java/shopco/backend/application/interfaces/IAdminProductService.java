package shopco.backend.application.interfaces;

import java.util.List;
import shopco.backend.application.dto.admin.*;
import shopco.backend.domain.enums.ProductStatus;

/**
 * Service interface for admin product operations
 */
public interface IAdminProductService {
    
    /**
     * Get all products with pagination and filters for admin
     */
    AdminProductListResponse getAllProducts(int page, int size, String sortBy, String sortDir,
            String keyword, String status, String brandId, String categoryId);
    
    /**
     * Get a single product by ID
     */
    AdminProductResponse getProductById(String id);
    
    /**
     * Create a new product
     */
    AdminProductResponse createProduct(CreateProductRequest request);
    
    /**
     * Update an existing product
     */
    AdminProductResponse updateProduct(String id, UpdateProductRequest request);
    
    /**
     * Delete a product
     */
    BulkActionResponse deleteProduct(String id);
    
    /**
     * Bulk delete products
     */
    BulkActionResponse bulkDeleteProducts(List<String> ids);
    
    /**
     * Publish a product
     */
    AdminProductResponse publishProduct(String id);
    
    /**
     * Archive a product
     */
    AdminProductResponse archiveProduct(String id);
    
    /**
     * Update product status
     */
    AdminProductResponse updateProductStatus(String id, ProductStatus status);
    
    /**
     * Bulk update product status
     */
    BulkActionResponse bulkUpdateStatus(List<String> ids, ProductStatus status);
}
