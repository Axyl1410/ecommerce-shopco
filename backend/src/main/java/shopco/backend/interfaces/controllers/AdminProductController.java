package shopco.backend.interfaces.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import shopco.backend.application.dto.admin.*;
import shopco.backend.application.interfaces.IAdminProductService;
import shopco.backend.domain.enums.ProductStatus;

/**
 * REST Controller for admin product management
 */
@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final IAdminProductService adminProductService;

    public AdminProductController(IAdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    /**
     * Get all products with pagination and filters
     */
    @GetMapping
    public ResponseEntity<AdminProductListResponse> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String brandId,
            @RequestParam(required = false) String categoryId) {
        
        AdminProductListResponse response = adminProductService.getAllProducts(
                page, size, sortBy, sortDir, keyword, status, brandId, categoryId);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get a single product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminProductResponse> getProductById(@PathVariable String id) {
        AdminProductResponse response = adminProductService.getProductById(id);
        
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new product
     */
    @PostMapping
    public ResponseEntity<AdminProductResponse> createProduct(@RequestBody CreateProductRequest request) {
        AdminProductResponse response = adminProductService.createProduct(request);
        
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update an existing product
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdminProductResponse> updateProduct(
            @PathVariable String id,
            @RequestBody UpdateProductRequest request) {
        
        AdminProductResponse response = adminProductService.updateProduct(id, request);
        
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a single product
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<BulkActionResponse> deleteProduct(@PathVariable String id) {
        BulkActionResponse response = adminProductService.deleteProduct(id);
        
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Bulk delete products
     */
    @PostMapping("/bulk-delete")
    public ResponseEntity<BulkActionResponse> bulkDeleteProducts(@RequestBody List<String> ids) {
        BulkActionResponse response = adminProductService.bulkDeleteProducts(ids);
        return ResponseEntity.ok(response);
    }

    /**
     * Publish a product
     */
    @PostMapping("/{id}/publish")
    public ResponseEntity<AdminProductResponse> publishProduct(@PathVariable String id) {
        AdminProductResponse response = adminProductService.publishProduct(id);
        
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Archive a product
     */
    @PostMapping("/{id}/archive")
    public ResponseEntity<AdminProductResponse> archiveProduct(@PathVariable String id) {
        AdminProductResponse response = adminProductService.archiveProduct(id);
        
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Update product status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminProductResponse> updateProductStatus(
            @PathVariable String id,
            @RequestParam ProductStatus status) {
        
        AdminProductResponse response = adminProductService.updateProductStatus(id, status);
        
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Bulk update product status
     */
    @PostMapping("/bulk-status")
    public ResponseEntity<BulkActionResponse> bulkUpdateStatus(
            @RequestBody List<String> ids,
            @RequestParam ProductStatus status) {
        
        BulkActionResponse response = adminProductService.bulkUpdateStatus(ids, status);
        return ResponseEntity.ok(response);
    }
}
