package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.CouponExcludedCategory;

@Repository
public interface CouponExcludedCategoryRepository extends JpaRepository<CouponExcludedCategory, String> {

}
