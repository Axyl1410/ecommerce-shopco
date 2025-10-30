package shopco.backend.domain.repositories;

import java.util.List;
import java.util.Optional;

import shopco.backend.domain.entities.CartItemEntity;

public interface ICartItemRepository {
    CartItemEntity save(CartItemEntity cartItem);
    Optional<CartItemEntity> findById(String id);
    List<CartItemEntity> findByCartId(String cartId);
    Optional<CartItemEntity> findByCartIdAndVariantId(String cartId, String variantId);
    void deleteById(String id);
    void deleteByCartId(String cartId);
}

