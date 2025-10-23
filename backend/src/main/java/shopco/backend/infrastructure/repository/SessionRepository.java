package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {

}
