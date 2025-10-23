package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

}
