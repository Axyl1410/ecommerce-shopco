package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

}
