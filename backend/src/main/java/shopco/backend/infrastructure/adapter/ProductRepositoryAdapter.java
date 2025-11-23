package shopco.backend.infrastructure.adapter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import shopco.backend.domain.entities.ProductEntity;
import shopco.backend.domain.entities.BrandEntity;
import shopco.backend.domain.entities.CategoryEntity;
import shopco.backend.domain.repositories.IProductRepository;
import shopco.backend.infrastructure.model.Product;
import shopco.backend.infrastructure.repository.ProductRepository;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductRepositoryAdapter implements IProductRepository {

    private final ProductRepository productRepository;

    public ProductRepositoryAdapter(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductEntity> searchProducts(String query, String categoryId, String brandId, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Product> productPage = productRepository.searchProducts(query, categoryId, brandId, pageable);

        return productPage.getContent().stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtain the total number of products matching the given search filters.
     *
     * @param query      full-text search query to match against product fields
     * @param categoryId filter by category identifier (may be null or empty to disable)
     * @param brandId    filter by brand identifier (may be null or empty to disable)
     * @return           the total number of products that match the provided filters
     */
    @Override
    public long countSearchResults(String query, String categoryId, String brandId) {
        Pageable pageable = PageRequest.of(0, 1);
        Page<Product> productPage = productRepository.searchProducts(query, categoryId, brandId, pageable);
        return productPage.getTotalElements();
    }

    /**
     * Fetches a paginated list of products filtered by category, brand, and status and converts them to domain entities.
     *
     * @param categoryId the category identifier to filter by, or {@code null} to ignore this filter
     * @param brandId    the brand identifier to filter by, or {@code null} to ignore this filter
     * @param status     the product status to filter by, or {@code null} to ignore this filter
     * @param page       the 1-based page number to retrieve
     * @param limit      the maximum number of items per page
     * @return a list of products converted to {@code ProductEntity} instances for the requested page
     */
    @Override
    public List<ProductEntity> findAllProducts(String categoryId, String brandId, String status, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Product> productPage = productRepository.findAllProducts(categoryId, brandId, status, pageable);

        return productPage.getContent().stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves the total number of products matching the provided category, brand, and status filters.
     *
     * @param categoryId filter by category identifier, or null to ignore
     * @param brandId    filter by brand identifier, or null to ignore
     * @param status     filter by product status, or null to ignore
     * @return the total count of matching products
     */
    @Override
    public long countAllProducts(String categoryId, String brandId, String status) {
        Pageable pageable = PageRequest.of(0, 1);
        Page<Product> productPage = productRepository.findAllProducts(categoryId, brandId, status, pageable);
        return productPage.getTotalElements();
    }

    /**
     * Converts an infrastructure Product model to a domain ProductEntity.
     *
     * @param product the infrastructure Product model to convert
     * @return a ProductEntity populated with values copied from the provided product
     */
    private ProductEntity convertToEntity(Product product) {
        ProductEntity entity = new ProductEntity();
        entity.setId(product.getId());
        entity.setName(product.getName());
        entity.setSlug(product.getSlug());
        entity.setDescription(product.getDescription());
        entity.setBrandId(product.getBrandId());
        entity.setCategoryId(product.getCategoryId());
        entity.setDefaultImage(product.getDefaultImage());
        entity.setSeoMetaTitle(product.getSeoMetaTitle());
        entity.setSeoMetaDesc(product.getSeoMetaDesc());
        entity.setStatus(product.getStatus());
        entity.setCreatedAt(product.getCreatedAt());
        entity.setUpdatedAt(product.getUpdatedAt());
        return entity;
    }
}