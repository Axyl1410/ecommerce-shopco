package shopco.backend.interfaces.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import shopco.backend.application.dto.profile.*;
import shopco.backend.application.use_cases.ProfileService;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // In lieu of full auth, read user id from header or request param
    private String resolveUserId(String headerUserId, String paramUserId) {
        if (headerUserId != null && !headerUserId.isBlank()) return headerUserId;
        if (paramUserId != null && !paramUserId.isBlank()) return paramUserId;
        throw new RuntimeException("Missing user id. Provide 'X-User-Id' header or 'userId' query param");
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader(value = "X-User-Id", required = false) String userId,
                                        @RequestParam(value = "userId", required = false) String userIdParam) {
        String uid = resolveUserId(userId, userIdParam);
        Optional<UserProfileDTO> dto = profileService.getProfile(uid);
        return dto.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping
    public ResponseEntity<?> updateProfile(@RequestHeader(value = "X-User-Id", required = false) String userId,
                                           @RequestParam(value = "userId", required = false) String userIdParam,
                                           @RequestBody UpdateProfileDTO body) {
        String uid = resolveUserId(userId, userIdParam);
        Optional<UserProfileDTO> dto = profileService.updateProfile(uid, body);
        return dto.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/addresses")
    public List<AddressDTO> listAddresses(@RequestHeader(value = "X-User-Id", required = false) String userId,
                                          @RequestParam(value = "userId", required = false) String userIdParam) {
        String uid = resolveUserId(userId, userIdParam);
        return profileService.listAddresses(uid);
    }

    @PostMapping("/addresses")
    public AddressDTO createAddress(@RequestHeader(value = "X-User-Id", required = false) String userId,
                                    @RequestParam(value = "userId", required = false) String userIdParam,
                                    @RequestBody AddressDTO body) {
        String uid = resolveUserId(userId, userIdParam);
        return profileService.createAddress(uid, body);
    }

    @PatchMapping("/addresses/{id}")
    public ResponseEntity<?> updateAddress(@RequestHeader(value = "X-User-Id", required = false) String userId,
                                           @RequestParam(value = "userId", required = false) String userIdParam,
                                           @PathVariable("id") String id,
                                           @RequestBody AddressDTO body) {
        String uid = resolveUserId(userId, userIdParam);
        return profileService.updateAddress(uid, id, body)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<?> deleteAddress(@RequestHeader(value = "X-User-Id", required = false) String userId,
                                           @RequestParam(value = "userId", required = false) String userIdParam,
                                           @PathVariable("id") String id) {
        String uid = resolveUserId(userId, userIdParam);
        boolean ok = profileService.deleteAddress(uid, id);
        return ok ? ResponseEntity.ok(Map.of("ok", true)) : ResponseEntity.notFound().build();
    }

    @PostMapping("/addresses/default")
    public ResponseEntity<?> setDefault(@RequestHeader(value = "X-User-Id", required = false) String userId,
                                        @RequestParam(value = "userId", required = false) String userIdParam,
                                        @RequestBody Map<String, String> body) {
        String uid = resolveUserId(userId, userIdParam);
        String id = body.get("id");
        if (id == null || id.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "id is required"));
        }
        return profileService.setDefaultAddress(uid, id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/activity")
    public Map<String, Object> getActivity(@RequestHeader(value = "X-User-Id", required = false) String userId,
                                           @RequestParam(value = "userId", required = false) String userIdParam) {
        String uid = resolveUserId(userId, userIdParam);
        List<OrderSummaryDTO> orders = profileService.listOrderSummaries(uid);
        List<ReviewDTO> reviews = profileService.listReviews(uid);
        Map<String, Object> res = new HashMap<>();
        res.put("orders", orders);
        res.put("reviews", reviews);
        return res;
    }
}
