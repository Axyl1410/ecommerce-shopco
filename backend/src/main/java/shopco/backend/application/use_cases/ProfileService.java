package shopco.backend.application.use_cases;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import shopco.backend.application.dto.profile.*;
import shopco.backend.infrastructure.model.Address;
import shopco.backend.infrastructure.model.Order;
import shopco.backend.infrastructure.model.Review;
import shopco.backend.infrastructure.model.User;
import shopco.backend.infrastructure.repository.AddressRepository;
import shopco.backend.infrastructure.repository.OrderRepository;
import shopco.backend.infrastructure.repository.ReviewRepository;
import shopco.backend.infrastructure.repository.OrderItemRepository;
import shopco.backend.infrastructure.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;

    public Optional<UserProfileDTO> getProfile(String userId) {
        return userRepository.findById(userId).map(u -> new UserProfileDTO(
                u.getId(), u.getName(), u.getEmail(), u.getImage(), u.getCreatedAt(), u.getUpdatedAt()));
    }

    @Transactional
    public Optional<UserProfileDTO> updateProfile(String userId, UpdateProfileDTO dto) {
        return userRepository.findById(userId).map(u -> {
            if (dto.name != null && !dto.name.isBlank()) {
                u.setName(dto.name);
            }
            if (dto.avatarUrl != null && !dto.avatarUrl.isBlank()) {
                u.setImage(dto.avatarUrl);
            }
            User saved = userRepository.save(u);
            return new UserProfileDTO(saved.getId(), saved.getName(), saved.getEmail(), saved.getImage(),
                    saved.getCreatedAt(), saved.getUpdatedAt());
        });
    }

    public List<AddressDTO> listAddresses(String userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).stream().map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDTO createAddress(String userId, AddressDTO dto) {
        if (Boolean.TRUE.equals(dto.isDefault)) {
            addressRepository.clearDefaultForUser(userId);
        }
        Address address = new Address();
        address.setId(UUID.randomUUID().toString());
        address.setUserId(userId);
        address.setName(dto.name);
        address.setPhone(dto.phone);
        address.setAddressLine(dto.addressLine);
        address.setCity(dto.city);
        address.setDistrict(dto.district);
        address.setProvince(dto.province);
        address.setPostalCode(dto.postalCode);
        address.setIsDefault(Boolean.TRUE.equals(dto.isDefault));
        Address saved = addressRepository.save(address);
        return toDto(saved);
    }

    @Transactional
    public Optional<AddressDTO> updateAddress(String userId, String id, AddressDTO dto) {
        return addressRepository.findByIdAndUserId(id, userId).map(a -> {
            if (dto.name != null)
                a.setName(dto.name);
            if (dto.phone != null)
                a.setPhone(dto.phone);
            if (dto.addressLine != null)
                a.setAddressLine(dto.addressLine);
            if (dto.city != null)
                a.setCity(dto.city);
            if (dto.district != null)
                a.setDistrict(dto.district);
            if (dto.province != null)
                a.setProvince(dto.province);
            if (dto.postalCode != null)
                a.setPostalCode(dto.postalCode);
            if (dto.isDefault != null && dto.isDefault) {
                addressRepository.clearDefaultForUser(userId);
                a.setIsDefault(true);
            }
            Address saved = addressRepository.save(a);
            return toDto(saved);
        });
    }

    @Transactional
    public boolean deleteAddress(String userId, String id) {
        return addressRepository.findByIdAndUserId(id, userId).map(a -> {
            addressRepository.delete(a);
            return true;
        }).orElse(false);
    }

    @Transactional
    public Optional<AddressDTO> setDefaultAddress(String userId, String id) {
        return addressRepository.findByIdAndUserId(id, userId).map(a -> {
            addressRepository.clearDefaultForUser(userId);
            a.setIsDefault(true);
            Address saved = addressRepository.save(a);
            return toDto(saved);
        });
    }

    public List<OrderSummaryDTO> listOrderSummaries(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toOrderSummary)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> listReviews(String userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toReviewDto)
                .collect(Collectors.toList());
    }

    private AddressDTO toDto(Address a) {
        AddressDTO dto = new AddressDTO();
        dto.id = a.getId();
        dto.userId = a.getUserId();
        dto.name = a.getName();
        dto.phone = a.getPhone();
        dto.addressLine = a.getAddressLine();
        dto.city = a.getCity();
        dto.district = a.getDistrict();
        dto.province = a.getProvince();
        dto.postalCode = a.getPostalCode();
        dto.isDefault = a.getIsDefault();
        dto.createdAt = a.getCreatedAt();
        return dto;
    }

    private OrderSummaryDTO toOrderSummary(Order o) {
        OrderSummaryDTO dto = new OrderSummaryDTO();
        dto.id = o.getId();
        dto.code = o.getOrderNo();
        dto.createdAt = o.getCreatedAt();
        dto.total = o.getFinalAmount();
        dto.status = o.getOrderStatus();
        // Order entity does not expose items; count via repository to avoid changing entities
        dto.itemsCount = (int) orderItemRepository.countByOrderId(o.getId());
        return dto;
    }

    private ReviewDTO toReviewDto(Review r) {
        ReviewDTO dto = new ReviewDTO();
        dto.id = r.getId();
        dto.productId = r.getProductId();
        dto.rating = r.getRating();
        dto.title = r.getTitle();
        dto.body = r.getBody();
        dto.createdAt = r.getCreatedAt();
        return dto;
    }
 }
