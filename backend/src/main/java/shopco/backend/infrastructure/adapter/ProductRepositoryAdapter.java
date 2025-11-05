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

    @Override
    public long countSearchResults(String query, String categoryId, String brandId) {
        Pageable pageable = PageRequest.of(0, 1);
        Page<Product> productPage = productRepository.searchProducts(query, categoryId, brandId, pageable);
        return productPage.getTotalElements();
    }

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
