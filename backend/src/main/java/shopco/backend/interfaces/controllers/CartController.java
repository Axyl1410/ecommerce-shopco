package shopco.backend.interfaces.controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shopco.backend.application.dto.CartRequest;
import shopco.backend.application.dto.CartResponse;
import shopco.backend.application.dto.UpdateCartItemRequest;
import shopco.backend.application.interfaces.ICartService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {
    
    private final ICartService cartService;
    
    public CartController(ICartService cartService) {
        this.cartService = cartService;
    }
    
    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("result", "SUCCESS");
        response.put("message", "CartController is alive");
        response.put("data", null);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addToCart(@Valid @RequestBody CartRequest request) {
        try {
            CartResponse cart = cartService.addToCart(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("result", "SUCCESS");
            response.put("message", "Item added to cart successfully");
            response.put("data", cart);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("result", "ERROR");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getCartByUserId(@PathVariable String userId) {
        try {
            CartResponse cart = cartService.getCartByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("result", "SUCCESS");
            response.put("message", "Cart retrieved successfully");
            response.put("data", cart);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("result", "ERROR");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, Object>> getCartBySessionId(@PathVariable String sessionId) {
        try {
            CartResponse cart = cartService.getCartBySessionId(sessionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("result", "SUCCESS");
            response.put("message", "Cart retrieved successfully");
            response.put("data", cart);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("result", "ERROR");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<Map<String, Object>> updateCartItemQuantity(
            @PathVariable String cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        try {
            CartResponse cart = cartService.updateCartItemQuantity(cartItemId, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("result", "SUCCESS");
            response.put("message", "Cart item updated successfully");
            response.put("data", cart);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("result", "ERROR");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Map<String, Object>> removeCartItem(@PathVariable String cartItemId) {
        try {
            cartService.removeCartItem(cartItemId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("result", "SUCCESS");
            response.put("message", "Cart item removed successfully");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("result", "ERROR");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<Map<String, Object>> clearCart(@PathVariable String cartId) {
        try {
            cartService.clearCart(cartId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("result", "SUCCESS");
            response.put("message", "Cart cleared successfully");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("result", "ERROR");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}

