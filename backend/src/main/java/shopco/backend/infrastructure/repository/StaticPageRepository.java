package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.StaticPage;

@Repository
public interface StaticPageRepository extends JpaRepository<StaticPage, String> {

}
