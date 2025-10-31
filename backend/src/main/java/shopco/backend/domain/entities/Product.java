package app.domain.entities;

import app.domain.value_objects.Money;
import app.domain.value_objects.ProductStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class Product {
    private final String id;
    private String name;
    private String slug;
    private String description;
    private String brandId;
    private String categoryId;
    private String defaultImage;
    private Money price;
    private ProductStatus status;
    private int stockQuantity;
    private double averageRating;
    private int reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean hasPromotion;
    private String promotionName;
    private List<ProductVariant> variants;

    public boolean isInStock() {
        return stockQuantity > 0;
    }

    public void calculateRating(List<Integer> ratings) {
        if (ratings == null || ratings.isEmpty()) {
            this.averageRating = 0.0;
            this.reviewCount = 0;
            return;
        }
        
        this.reviewCount = ratings.size();
        this.averageRating = ratings.stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);
    }
}