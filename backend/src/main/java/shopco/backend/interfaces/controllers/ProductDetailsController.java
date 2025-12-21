package shopco.backend.interfaces.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import shopco.backend.application.dto.ProductDetailsDto;
import shopco.backend.application.interfaces.IProductServiceDetails;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductDetailsController {

    private final IProductServiceDetails productServiceDetails;

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailsDto> getProductDetails(@PathVariable String id) {
        Optional<ProductDetailsDto> productOpt = productServiceDetails.getProductDetails(id);
        if (productOpt.isPresent()) {
            return ResponseEntity.ok(productOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}