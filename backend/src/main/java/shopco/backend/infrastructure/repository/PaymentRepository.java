package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

}
