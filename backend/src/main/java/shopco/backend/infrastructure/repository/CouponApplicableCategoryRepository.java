package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.CouponApplicableCategory;

@Repository
public interface CouponApplicableCategoryRepository extends JpaRepository<CouponApplicableCategory, String> {

}
