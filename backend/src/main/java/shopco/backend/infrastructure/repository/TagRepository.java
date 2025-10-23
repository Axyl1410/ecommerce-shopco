package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, String> {

}
