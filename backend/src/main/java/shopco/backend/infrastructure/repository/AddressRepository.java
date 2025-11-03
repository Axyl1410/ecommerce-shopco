package shopco.backend.infrastructure.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import shopco.backend.infrastructure.model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {

	List<Address> findByUserIdOrderByIsDefaultDescCreatedAtDesc(String userId);

	Optional<Address> findByIdAndUserId(String id, String userId);

	@Modifying
	@Transactional
	@Query("update Address a set a.isDefault = false where a.userId = :userId")
	int clearDefaultForUser(String userId);
}
