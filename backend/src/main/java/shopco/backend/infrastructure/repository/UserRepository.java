package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

}
