package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.WishlistItem;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, String> {

}
