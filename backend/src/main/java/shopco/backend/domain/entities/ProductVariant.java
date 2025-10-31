package app.domain.value_objects;

import lombok.Value;

@Value
public class ProductVariant {
    String id;
    String productId;
    String color;
    String size;
    Money price;
    int stockQuantity;
}