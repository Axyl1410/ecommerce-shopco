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

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("result", "SUCCESS");
        response.put("message", "ProductController is alive");
        response.put("data", null);
        return ResponseEntity.ok(response);
    }

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
