package shopco.backend.infrastructure.adapter;

import shopco.backend.domain.entities.ProductEntity;
import shopco.backend.domain.repositories.IProductRepositoryDetails;
import shopco.backend.infrastructure.model.Product;
import shopco.backend.infrastructure.repository.ProductRepository;
import java.util.Optional;

public class ProductRepositoryAdapterDetails implements IProductRepositoryDetails {

    private final ProductRepository productRepository;

    public ProductRepositoryAdapterDetails(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Optional<ProductEntity> findProductById(String id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            return Optional.of(convertToEntity(product));
        }
        return Optional.empty();
    }

    /**
     * Converts an infrastructure Product model to a domain ProductEntity with full details.
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

        // Set relationships if available
        // Brand and Category entities would need separate repository calls
        entity.setBrand(null);
        entity.setCategory(null);
        // Set other collections
        entity.setVariants(null); // Would need to fetch separately
        entity.setImages(null); // Would need to fetch separately
        entity.setReviews(null); // Would need to fetch separately
        entity.setWishlistItems(null); // Would need to fetch separately
        entity.setTags(null); // Would need to fetch separately
        entity.setApplicableCoupons(null); // Would need to fetch separately
        entity.setExcludedCoupons(null); // Would need to fetch separately

        return entity;
    }
}