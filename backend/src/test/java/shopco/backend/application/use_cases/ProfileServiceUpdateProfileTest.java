package shopco.backend.application.use_cases;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import shopco.backend.application.dto.profile.UpdateProfileDTO;
import shopco.backend.application.dto.profile.UserProfileDTO;
import shopco.backend.infrastructure.model.User;
import shopco.backend.infrastructure.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceUpdateProfileTest {

    @Mock
    private UserRepository userRepository;

    // We need to mock other repositories if ProfileService constructor requires them,
    // but @InjectMocks will inject nulls for missing mocks if not strict.
    // However, to be safe and clean, we only strictly need UserRepository for updateProfile.
    // If ProfileService has other dependencies that are final, @InjectMocks usually handles them if we provide mocks.
    // Let's see if we need to mock others. For now, just UserRepository is used in the method under test.

    @InjectMocks
    private ProfileService profileService;

    /**
     * Kịch bản 2: Cập nhật thành công (Success Scenario)
     * User exists and valid data is provided.
     */
    @Test
    void updateProfile_shouldUpdateUser_whenUserExistsAndDataIsValid() {
        // Arrange
        String userId = "user-123";
        String originalName = "Old Name";
        String originalImage = "old.jpg";
        String originalEmail = "test@example.com";

        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setName(originalName);
        existingUser.setImage(originalImage);
        existingUser.setEmail(originalEmail);

        UpdateProfileDTO dto = new UpdateProfileDTO();
        dto.name = "New Name";
        dto.avatarUrl = "new.jpg";

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Optional<UserProfileDTO> result = profileService.updateProfile(userId, dto);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("New Name", result.get().name);
        assertEquals("new.jpg", result.get().image);
        
        // Verify repository interaction
        verify(userRepository).save(argThat(user -> 
            user.getName().equals("New Name") && 
            user.getImage().equals("new.jpg")
        ));
    }

   

    /**
     * Kịch bản 1: Dữ liệu không hợp lệ (Failure/Edge Case Scenario)
     * Case: Data is blank/invalid (Business rule: ignore blank updates).
     * The service logic ignores blank fields, so the user should remain unchanged.
     */
    @Test
    void updateProfile_shouldNotUpdateFields_whenDataIsBlankOrInvalid() {
        // Arrange
        String userId = "user-123";
        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setName("Original Name");
        existingUser.setImage("original.jpg");
        existingUser.setEmail("test@example.com");

        UpdateProfileDTO dto = new UpdateProfileDTO();
        dto.name = "";      // Blank name
        dto.avatarUrl = ""; // Blank avatar

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Optional<UserProfileDTO> result = profileService.updateProfile(userId, dto);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Original Name", result.get().name); // Should not change
        assertEquals("original.jpg", result.get().image); // Should not change

        verify(userRepository).save(argThat(user -> 
            user.getName().equals("Original Name") && 
            user.getImage().equals("original.jpg")
        ));
    }
}
