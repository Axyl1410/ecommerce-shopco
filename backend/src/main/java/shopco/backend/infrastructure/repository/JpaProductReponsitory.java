package app.infrastructure.persistence;

import app.domain.repositories.ProductRepository;
import app.domain.repositories.ProductSearchCriteria;
import app.domain.repositories.PagedResult;
import app.domain.entities.Product;
import app.domain.value_objects.Money;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class JpaProductRepository implements ProductRepository {
    private final EntityManager entityManager;

    @Override
    public PagedResult<Product> search(ProductSearchCriteria criteria) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> root = query.from(Product.class);

        List<Predicate> predicates = new ArrayList<>();

        // Add filters
        if (criteria.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(
                root.get("price"), criteria.getMinPrice().getAmount()));
        }

        if (criteria.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(
                root.get("price"), criteria.getMaxPrice().getAmount()));
        }

        if (!CollectionUtils.isEmpty(criteria.getCategoryIds())) {
            predicates.add(root.get("categoryId").in(criteria.getCategoryIds()));
        }

        if (!CollectionUtils.isEmpty(criteria.getBrandIds())) {
            predicates.add(root.get("brandId").in(criteria.getBrandIds()));
        }

        if (criteria.getInStock() != null) {
            if (criteria.getInStock()) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            } else {
                predicates.add(cb.equal(root.get("stockQuantity"), 0));
            }
        }

        if (criteria.getMinRating() != null) {
            predicates.add(cb.greaterThanOrEqualTo(
                root.get("averageRating"), criteria.getMinRating()));
        }

        if (criteria.getHasPromotion() != null) {
            predicates.add(cb.equal(root.get("hasPromotion"), 
                criteria.getHasPromotion()));
        }

        // Apply predicates
        if (!predicates.isEmpty()) {
            query.where(cb.and(predicates.toArray(new Predicate[0])));
        }

        // Apply sorting
        if ("asc".equalsIgnoreCase(criteria.getSortDirection())) {
            query.orderBy(cb.asc(root.get(criteria.getSortBy())));
        } else {
            query.orderBy(cb.desc(root.get(criteria.getSortBy())));
        }

        // Execute query with pagination
        var typedQuery = entityManager.createQuery(query)
                .setFirstResult(criteria.getPage() * criteria.getPageSize())
                .setMaxResults(criteria.getPageSize());

        List<Product> results = typedQuery.getResultList();

        // Get total count
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Product> countRoot = countQuery.from(Product.class);
        countQuery.select(cb.count(countRoot));
        if (!predicates.isEmpty()) {
            countQuery.where(cb.and(predicates.toArray(new Predicate[0])));
        }
        Long totalItems = entityManager.createQuery(countQuery).getSingleResult();

        return new PagedResult<>(
            results,
            criteria.getPage(),
            criteria.getPageSize(),
            totalItems,
            (int) Math.ceil((double) totalItems / criteria.getPageSize())
        );
    }

    @Override
    public Map<String, Long> getProductCountByCategory() {
        var query = "SELECT p.categoryId, COUNT(p) FROM Product p GROUP BY p.categoryId";
        var results = entityManager.createQuery(query, Object[].class).getResultList();
        
        return results.stream()
                .collect(Collectors.toMap(
                    row -> (String) row[0],
                    row -> (Long) row[1]
                ));
    }

    @Override
    public List<String> getAvailableColors() {
        return entityManager.createQuery(
            "SELECT DISTINCT v.color FROM ProductVariant v", String.class)
            .getResultList();
    }

    @Override
    public List<String> getAvailableSizes() {
        return entityManager.createQuery(
            "SELECT DISTINCT v.size FROM ProductVariant v", String.class)
            .getResultList();
    }

    @Override
    public Pair<Money, Money> getPriceRange() {
        var query = """
            SELECT MIN(v.price), MAX(v.price) 
            FROM ProductVariant v
            """;
        var result = entityManager.createQuery(query, Object[].class)
                .getSingleResult();
                
        return Pair.of(
            Money.of((BigDecimal) result[0]),
            Money.of((BigDecimal) result[1])
        );
    }
}