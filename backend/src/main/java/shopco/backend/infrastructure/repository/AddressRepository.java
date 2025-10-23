package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {

}
