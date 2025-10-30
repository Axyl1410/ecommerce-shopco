package shopco.backend.infrastructure.persistence;

import org.springframework.stereotype.Component;
import shopco.backend.domain.entities.CartItemEntity;
import shopco.backend.domain.repositories.ICartItemRepository;
import shopco.backend.infrastructure.model.CartItem;
import shopco.backend.infrastructure.repository.CartItemRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CartItemRepositoryImpl implements ICartItemRepository {
    
    private final CartItemRepository jpaRepository;
    
    public CartItemRepositoryImpl(CartItemRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public CartItemEntity save(CartItemEntity cartItem) {
        CartItem jpaCartItem = toJpaModel(cartItem);
        CartItem saved = jpaRepository.save(jpaCartItem);
        return toDomainEntity(saved);
    }
    
    @Override
    public Optional<CartItemEntity> findById(String id) {
        return jpaRepository.findById(id)
            .map(this::toDomainEntity);
    }
    
    @Override
    public List<CartItemEntity> findByCartId(String cartId) {
        return jpaRepository.findByCartId(cartId).stream()
            .map(this::toDomainEntity)
            .collect(Collectors.toList());
    }
    
    @Override
    public Optional<CartItemEntity> findByCartIdAndVariantId(String cartId, String variantId) {
        return jpaRepository.findByCartIdAndVariantId(cartId, variantId)
            .map(this::toDomainEntity);
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public void deleteByCartId(String cartId) {
        jpaRepository.deleteByCartId(cartId);
    }
    
    private CartItem toJpaModel(CartItemEntity entity) {
        CartItem cartItem = new CartItem();
        cartItem.setId(entity.getId());
        cartItem.setCartId(entity.getCartId());
        cartItem.setVariantId(entity.getVariantId());
        cartItem.setQuantity(entity.getQuantity());
        cartItem.setPriceAtAdd(entity.getPriceAtAdd());
        cartItem.setCreatedAt(entity.getCreatedAt());
        return cartItem;
    }
    
    private CartItemEntity toDomainEntity(CartItem model) {
        CartItemEntity entity = new CartItemEntity();
        entity.setId(model.getId());
        entity.setCartId(model.getCartId());
        entity.setVariantId(model.getVariantId());
        entity.setQuantity(model.getQuantity());
        entity.setPriceAtAdd(model.getPriceAtAdd());
        entity.setCreatedAt(model.getCreatedAt());
        return entity;
    }
}

