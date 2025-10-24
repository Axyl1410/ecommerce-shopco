package shopco.backend.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shopco.backend.infrastructure.model.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, String> {

}
