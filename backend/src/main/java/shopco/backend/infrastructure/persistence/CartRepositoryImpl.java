package shopco.backend.infrastructure.persistence;

import org.springframework.stereotype.Component;
import shopco.backend.domain.entities.CartEntity;
import shopco.backend.domain.repositories.ICartRepository;
import shopco.backend.infrastructure.model.Cart;
import shopco.backend.infrastructure.repository.CartRepository;

import java.util.Optional;

@Component
public class CartRepositoryImpl implements ICartRepository {
    
    private final CartRepository jpaRepository;
    
    public CartRepositoryImpl(CartRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public CartEntity save(CartEntity cart) {
        Cart jpaCart = toJpaModel(cart);
        Cart saved = jpaRepository.save(jpaCart);
        return toDomainEntity(saved);
    }
    
    @Override
    public Optional<CartEntity> findById(String id) {
        return jpaRepository.findById(id)
            .map(this::toDomainEntity);
    }
    
    @Override
    public Optional<CartEntity> findByUserId(String userId) {
        return jpaRepository.findByUserId(userId)
            .map(this::toDomainEntity);
    }
    
    @Override
    public Optional<CartEntity> findBySessionId(String sessionId) {
        return jpaRepository.findBySessionId(sessionId)
            .map(this::toDomainEntity);
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public boolean existsById(String id) {
        return jpaRepository.existsById(id);
    }
    
    private Cart toJpaModel(CartEntity entity) {
        Cart cart = new Cart();
        cart.setId(entity.getId());
        cart.setUserId(entity.getUserId());
        cart.setSessionId(entity.getSessionId());
        cart.setCreatedAt(entity.getCreatedAt());
        cart.setUpdatedAt(entity.getUpdatedAt());
        return cart;
    }
    
    private CartEntity toDomainEntity(Cart model) {
        CartEntity entity = new CartEntity();
        entity.setId(model.getId());
        entity.setUserId(model.getUserId());
        entity.setSessionId(model.getSessionId());
        entity.setCreatedAt(model.getCreatedAt());
        entity.setUpdatedAt(model.getUpdatedAt());
        return entity;
    }
}

