package shopco.backend.infrastructure.persistence;

import org.springframework.stereotype.Component;
import shopco.backend.domain.entities.ProductEntity;
import shopco.backend.domain.entities.ProductVariantEntity;
import shopco.backend.domain.repositories.IProductVariantRepository;
import shopco.backend.infrastructure.model.ProductVariant;
import shopco.backend.infrastructure.repository.ProductVariantRepository;

import java.util.Optional;

@Component
public class ProductVariantRepositoryImpl implements IProductVariantRepository {
    
    private final ProductVariantRepository jpaRepository;
    
    public ProductVariantRepositoryImpl(ProductVariantRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public Optional<ProductVariantEntity> findById(String id) {
        return jpaRepository.findById(id)
            .map(this::toDomainEntity);
    }
    
    @Override
    public ProductVariantEntity save(ProductVariantEntity variant) {
        ProductVariant jpaVariant = toJpaModel(variant);
        ProductVariant saved = jpaRepository.save(jpaVariant);
        return toDomainEntity(saved);
    }
    
    private ProductVariant toJpaModel(ProductVariantEntity entity) {
        ProductVariant variant = new ProductVariant();
        variant.setId(entity.getId());
        variant.setProductId(entity.getProductId());
        variant.setSku(entity.getSku());
        variant.setAttributes(entity.getAttributes());
        variant.setPrice(entity.getPrice());
        variant.setSalePrice(entity.getSalePrice());
        variant.setStockQuantity(entity.getStockQuantity());
        variant.setWeight(entity.getWeight());
        variant.setBarcode(entity.getBarcode());
        return variant;
    }
    
    private ProductVariantEntity toDomainEntity(ProductVariant model) {
        ProductVariantEntity entity = new ProductVariantEntity();
        entity.setId(model.getId());
        entity.setProductId(model.getProductId());
        entity.setSku(model.getSku());
        entity.setAttributes(model.getAttributes());
        entity.setPrice(model.getPrice());
        entity.setSalePrice(model.getSalePrice());
        entity.setStockQuantity(model.getStockQuantity());
        entity.setWeight(model.getWeight());
        entity.setBarcode(model.getBarcode());
        
        // Set product entity if available
        if (model.getProduct() != null) {
            ProductEntity productEntity = new ProductEntity();
            productEntity.setId(model.getProduct().getId());
            productEntity.setName(model.getProduct().getName());
            entity.setProduct(productEntity);
        }
        
        return entity;
    }
}

