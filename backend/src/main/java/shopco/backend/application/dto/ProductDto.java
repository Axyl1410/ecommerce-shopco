package shopco.backend.application.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductDto {

    private String id;
    private String name;
    private String slug;
    private String description;
    private String defaultImage;
    private String categoryId;
    private String categoryName;
    private String brandId;
    private String brandName;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private List<String> tags;
    private int totalVariants;
    private String status;

    public ProductDto() {
    }

    public ProductDto(String id, String name, String slug, String description,
            String defaultImage, String categoryId, String categoryName,
            String brandId, String brandName, BigDecimal minPrice,
            BigDecimal maxPrice, List<String> tags, int totalVariants, String status) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.defaultImage = defaultImage;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.brandId = brandId;
        this.brandName = brandName;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.tags = tags;
        this.totalVariants = totalVariants;
        this.status = status;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDefaultImage() {
        return defaultImage;
    }

    public void setDefaultImage(String defaultImage) {
        this.defaultImage = defaultImage;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getBrandId() {
        return brandId;
    }

    public void setBrandId(String brandId) {
        this.brandId = brandId;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public int getTotalVariants() {
        return totalVariants;
    }

    public void setTotalVariants(int totalVariants) {
        this.totalVariants = totalVariants;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
