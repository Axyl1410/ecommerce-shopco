package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, String> {

}
