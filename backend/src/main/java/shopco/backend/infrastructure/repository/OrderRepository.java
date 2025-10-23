package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

}
