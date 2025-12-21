package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.CouponApplicableProduct;
import shopco.backend.infrastructure.model.CouponApplicableProduct.CouponApplicableProductId;

@Repository
public interface CouponApplicableProductRepository extends JpaRepository<CouponApplicableProduct, CouponApplicableProductId> {

}
