package app.interfaces.controllers;

import app.application.use_cases.ProductBrowseUseCase;
import app.application.dto.ProductBrowseRequest;
import app.interfaces.presenters.ProductPresenter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductBrowseUseCase productBrowseUseCase;
    private final ProductPresenter productPresenter;

    @PostMapping("/browse")
    public ResponseEntity<?> browseProducts(@RequestBody ProductBrowseRequest request) {
        var result = productBrowseUseCase.execute(request);
        return ResponseEntity.ok(productPresenter.presentPagedResult(result));
    }

    @GetMapping("/filter-options")
    public ResponseEntity<?> getFilterOptions() {
        var options = productBrowseUseCase.getFilterOptions();
        return ResponseEntity.ok(productPresenter.presentFilterOptions(options));
    }
}