package shopco.backend.interfaces.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shopco.backend.application.dto.ProductSearchRequest;
import shopco.backend.application.dto.ProductSearchResponse;
import shopco.backend.application.dto.ProductListRequest;
import shopco.backend.application.interfaces.IProductService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final IProductService productService;

    public ProductController(IProductService productService) {
        this.productService = productService;
    }

    /**
     * Provide a health-check payload indicating the ProductController is alive.
     *
     * @return a map containing keys "result" (set to "SUCCESS"), "message" (a status string), and "data" (null)
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("result", "SUCCESS");
        response.put("message", "ProductController is alive");
        response.put("data", null);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves a paginated list of products optionally filtered by category, brand, or status.
     *
     * @param page       page number to retrieve (1-based)
     * @param limit      maximum number of products per page
     * @param categoryId optional category identifier to filter products
     * @param brandId    optional brand identifier to filter products
     * @param status     optional product status to filter products
     * @return a ResponseEntity containing a Map with keys:
     *         - "result": `"SUCCESS"` when products are returned or `"ERROR"` on failure,
     *         - "message": a human-readable status message,
     *         - "data": a ProductSearchResponse when successful, or `null` on error.
     */
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String brandId,
            @RequestParam(required = false) String status) {
        try {
            ProductListRequest request = new ProductListRequest(page, limit, categoryId, brandId, status);
            ProductSearchResponse response = productService.getAllProducts(request);
            Map<String, Object> result = new HashMap<>();
            result.put("result", "SUCCESS");
            result.put("message", "Products retrieved successfully");
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("result", "ERROR");
            errorResponse.put("message", "An error occurred while retrieving products");
            errorResponse.put("data", null);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Searches products matching a free-text query with optional category and brand filters and paginated results.
     *
     * @param query      the search keywords to match against products
     * @param page       the page number to return, starting at 1
     * @param limit      the maximum number of items per page
     * @param categoryId optional category id to filter results
     * @param brandId    optional brand id to filter results
     * @return           a ResponseEntity whose body is a map with keys:
     *                   - "result": "SUCCESS" or "ERROR"
     *                   - "message": a human-readable status message
     *                   - "data": a ProductSearchResponse on success, or null on error
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String brandId) {
        try {
            ProductSearchRequest request = new ProductSearchRequest(query, page, limit, categoryId, brandId);
            ProductSearchResponse searchResponse = productService.searchProducts(request);

            Map<String, Object> response = new HashMap<>();
            response.put("result", "SUCCESS");
            response.put("message", "Products found");
            response.put("data", searchResponse);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("result", "ERROR");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("data", null);

            return ResponseEntity.badRequest().body(errorResponse);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("result", "ERROR");
            errorResponse.put("message", "An error occurred while searching products");
            errorResponse.put("data", null);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}