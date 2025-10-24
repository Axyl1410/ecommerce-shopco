package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.ProductTag;

@Repository
public interface ProductTagRepository extends JpaRepository<ProductTag, String> {

}
