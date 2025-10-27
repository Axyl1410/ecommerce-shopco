package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Coupon;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, String> {

}
