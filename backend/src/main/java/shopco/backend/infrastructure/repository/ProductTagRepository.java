package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.ProductTag;
import shopco.backend.infrastructure.model.ProductTag.ProductTagId;

import java.util.List;

@Repository
public interface ProductTagRepository extends JpaRepository<ProductTag, ProductTagId> {

    @Query("SELECT pt FROM ProductTag pt WHERE pt.productId = :productId")
    List<ProductTag> findByProductId(@Param("productId") String productId);
}
