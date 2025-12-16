package shopco.backend.infrastructure.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import shopco.backend.application.dto.admin.*;
import shopco.backend.application.interfaces.IAdminProductService;
import shopco.backend.domain.enums.ProductStatus;
import shopco.backend.infrastructure.model.Brand;
import shopco.backend.infrastructure.model.Category;
import shopco.backend.infrastructure.model.Product;
import shopco.backend.infrastructure.model.ProductTag;
import shopco.backend.infrastructure.model.ProductVariant;
import shopco.backend.infrastructure.model.Tag;
import shopco.backend.infrastructure.repository.BrandRepository;
import shopco.backend.infrastructure.repository.CategoryRepository;
import shopco.backend.infrastructure.repository.ProductRepository;
import shopco.backend.infrastructure.repository.ProductTagRepository;
import shopco.backend.infrastructure.repository.ProductVariantRepository;
import shopco.backend.infrastructure.repository.TagRepository;

@Service
public class AdminProductServiceImpl implements IAdminProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductTagRepository productTagRepository;
    private final TagRepository tagRepository;

    public AdminProductServiceImpl(
            ProductRepository productRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            ProductVariantRepository productVariantRepository,
            ProductTagRepository productTagRepository,
            TagRepository tagRepository) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.productVariantRepository = productVariantRepository;
        this.productTagRepository = productTagRepository;
        this.tagRepository = tagRepository;
    }

    /**
     * Helper method to check if string is null or empty
     */
    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminProductListResponse getAllProducts(int page, int size, String sortBy, String sortDir,
            String keyword, String status, String brandId, String categoryId) {
        
        // Build sort
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Query products
        Page<Product> productPage = productRepository.findAllProductsForAdmin(
                keyword, status, brandId, categoryId, pageable);
        
        // Convert to DTOs
        List<AdminProductDto> products = productPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return new AdminProductListResponse(
                products,
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                page,
                size);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminProductResponse getProductById(String id) {
        Optional<Product> productOpt = productRepository.findById(id);
        
        if (productOpt.isEmpty()) {
            return AdminProductResponse.error("Product not found");
        }
        
        AdminProductDto dto = convertToDto(productOpt.get());
        return AdminProductResponse.success("Product found", dto);
    }

    @Override
    @Transactional
    public AdminProductResponse createProduct(CreateProductRequest request) {
        // Validate slug uniqueness
        if (productRepository.existsBySlug(request.getSlug())) {
            return AdminProductResponse.error("Slug already exists");
        }
        
        Product product = new Product();
        product.setId(UUID.randomUUID().toString());
        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        // Convert empty strings to null for foreign keys
        product.setBrandId(isBlank(request.getBrandId()) ? null : request.getBrandId());
        product.setCategoryId(isBlank(request.getCategoryId()) ? null : request.getCategoryId());
        product.setDefaultImage(request.getDefaultImage());
        product.setSeoMetaTitle(request.getSeoMetaTitle());
        product.setSeoMetaDesc(request.getSeoMetaDesc());
        product.setStatus(request.getStatus() != null ? request.getStatus() : ProductStatus.DRAFT);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        
        Product savedProduct = productRepository.save(product);
        
        // Handle tags
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            for (String tagId : request.getTagIds()) {
                ProductTag productTag = new ProductTag();
                productTag.setProductId(savedProduct.getId());
                productTag.setTagId(tagId);
                productTagRepository.save(productTag);
            }
        }
        
        AdminProductDto dto = convertToDto(savedProduct);
        return AdminProductResponse.success("Product created successfully", dto);
    }

    @Override
    @Transactional
    public AdminProductResponse updateProduct(String id, UpdateProductRequest request) {
        Optional<Product> productOpt = productRepository.findById(id);
        
        if (productOpt.isEmpty()) {
            return AdminProductResponse.error("Product not found");
        }
        
        Product product = productOpt.get();
        
        // Check slug uniqueness if changed
        if (request.getSlug() != null && !request.getSlug().equals(product.getSlug())) {
            if (productRepository.existsBySlug(request.getSlug())) {
                return AdminProductResponse.error("Slug already exists");
            }
            product.setSlug(request.getSlug());
        }
        
        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        // Convert empty strings to null for foreign keys
        if (request.getBrandId() != null) product.setBrandId(isBlank(request.getBrandId()) ? null : request.getBrandId());
        if (request.getCategoryId() != null) product.setCategoryId(isBlank(request.getCategoryId()) ? null : request.getCategoryId());
        if (request.getDefaultImage() != null) product.setDefaultImage(request.getDefaultImage());
        if (request.getSeoMetaTitle() != null) product.setSeoMetaTitle(request.getSeoMetaTitle());
        if (request.getSeoMetaDesc() != null) product.setSeoMetaDesc(request.getSeoMetaDesc());
        if (request.getStatus() != null) product.setStatus(request.getStatus());
        
        product.setUpdatedAt(LocalDateTime.now());
        
        Product savedProduct = productRepository.save(product);
        
        // Handle tags update
        if (request.getTagIds() != null) {
            // Remove existing tags
            productTagRepository.deleteByProductId(id);
            
            // Add new tags
            for (String tagId : request.getTagIds()) {
                ProductTag productTag = new ProductTag();
                productTag.setProductId(savedProduct.getId());
                productTag.setTagId(tagId);
                productTagRepository.save(productTag);
            }
        }
        
        AdminProductDto dto = convertToDto(savedProduct);
        return AdminProductResponse.success("Product updated successfully", dto);
    }

    @Override
    @Transactional
    public BulkActionResponse deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            return BulkActionResponse.error("Product not found");
        }
        
        // Delete related data first
        productTagRepository.deleteByProductId(id);
        productVariantRepository.deleteByProductId(id);
        
        productRepository.deleteById(id);
        
        return BulkActionResponse.success("Product deleted successfully", 1);
    }

    @Override
    @Transactional
    public BulkActionResponse bulkDeleteProducts(List<String> ids) {
        int count = 0;
        for (String id : ids) {
            if (productRepository.existsById(id)) {
                productTagRepository.deleteByProductId(id);
                productVariantRepository.deleteByProductId(id);
                productRepository.deleteById(id);
                count++;
            }
        }
        
        return BulkActionResponse.success(count + " products deleted successfully", count);
    }

    @Override
    @Transactional
    public AdminProductResponse publishProduct(String id) {
        return updateProductStatus(id, ProductStatus.PUBLISHED);
    }

    @Override
    @Transactional
    public AdminProductResponse archiveProduct(String id) {
        return updateProductStatus(id, ProductStatus.ARCHIVED);
    }

    @Override
    @Transactional
    public AdminProductResponse updateProductStatus(String id, ProductStatus status) {
        Optional<Product> productOpt = productRepository.findById(id);
        
        if (productOpt.isEmpty()) {
            return AdminProductResponse.error("Product not found");
        }
        
        Product product = productOpt.get();
        product.setStatus(status);
        product.setUpdatedAt(LocalDateTime.now());
        
        Product savedProduct = productRepository.save(product);
        AdminProductDto dto = convertToDto(savedProduct);
        
        return AdminProductResponse.success("Product status updated to " + status, dto);
    }

    @Override
    @Transactional
    public BulkActionResponse bulkUpdateStatus(List<String> ids, ProductStatus status) {
        int count = 0;
        for (String id : ids) {
            Optional<Product> productOpt = productRepository.findById(id);
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                product.setStatus(status);
                product.setUpdatedAt(LocalDateTime.now());
                productRepository.save(product);
                count++;
            }
        }
        
        return BulkActionResponse.success(count + " products updated to " + status, count);
    }

    private AdminProductDto convertToDto(Product product) {
        AdminProductDto dto = new AdminProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setBrandId(product.getBrandId());
        dto.setCategoryId(product.getCategoryId());
        dto.setDefaultImage(product.getDefaultImage());
        dto.setSeoMetaTitle(product.getSeoMetaTitle());
        dto.setSeoMetaDesc(product.getSeoMetaDesc());
        dto.setStatus(product.getStatus());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        
        // Get brand name
        if (product.getBrandId() != null) {
            brandRepository.findById(product.getBrandId())
                    .ifPresent(brand -> dto.setBrandName(brand.getName()));
        }
        
        // Get category name
        if (product.getCategoryId() != null) {
            categoryRepository.findById(product.getCategoryId())
                    .ifPresent(category -> dto.setCategoryName(category.getName()));
        }
        
        // Get variants count
        int variantsCount = productVariantRepository.countByProductId(product.getId());
        dto.setVariantsCount(variantsCount);
        
        // Get tags
        List<ProductTag> productTags = productTagRepository.findByProductId(product.getId());
        List<String> tagNames = new ArrayList<>();
        for (ProductTag pt : productTags) {
            tagRepository.findById(pt.getTagId())
                    .ifPresent(tag -> tagNames.add(tag.getName()));
        }
        dto.setTags(tagNames);
        
        return dto;
    }
}
