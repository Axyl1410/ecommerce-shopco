package shopco.backend.domain.repositories;

import java.util.Optional;

import shopco.backend.domain.entities.CartEntity;

public interface ICartRepository {
    CartEntity save(CartEntity cart);
    Optional<CartEntity> findById(String id);
    Optional<CartEntity> findByUserId(String userId);
    Optional<CartEntity> findBySessionId(String sessionId);
    void deleteById(String id);
    boolean existsById(String id);
}

