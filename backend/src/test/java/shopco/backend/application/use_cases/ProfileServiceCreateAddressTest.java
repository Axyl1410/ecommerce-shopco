package shopco.backend.application.use_cases;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import shopco.backend.application.dto.profile.AddressDTO;
import shopco.backend.infrastructure.model.Address;
import shopco.backend.infrastructure.repository.AddressRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ProfileService.createAddress() method to verify
 * that client-provided IDs are ignored and server-generated IDs are used.
 */
@ExtendWith(MockitoExtension.class)
class ProfileServiceCreateAddressTest {

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private ProfileService profileService;

    @Test
    void createAddress_shouldGenerateIdAndIgnoreClientProvidedId() {
        // Arrange
        String testUserId = "user123";
        String clientProvidedId = "malicious-id-12345";
        
        AddressDTO dto = new AddressDTO();
        dto.id = clientProvidedId; // Client attempts to provide ID
        dto.name = "Test Name";
        dto.phone = "1234567890";
        dto.addressLine = "123 Test St";
        dto.city = "City";
        dto.district = "District";
        dto.province = "Province";
        dto.postalCode = "12345";
        dto.isDefault = false;

        // Mock the repository save to return the address with a generated ID
        when(addressRepository.save(any(Address.class))).thenAnswer(invocation -> {
            Address savedAddress = invocation.getArgument(0);
            // Simulate that the address has been saved with the generated ID
            return savedAddress;
        });

        // Act
        AddressDTO result = profileService.createAddress(testUserId, dto);

        // Assert
        ArgumentCaptor<Address> addressCaptor = ArgumentCaptor.forClass(Address.class);
        verify(addressRepository).save(addressCaptor.capture());
        
        Address capturedAddress = addressCaptor.getValue();
        
        // Verify that the ID was generated (not null and not empty)
        assertNotNull(capturedAddress.getId(), "ID should be generated");
        assertFalse(capturedAddress.getId().isEmpty(), "Generated ID should not be empty");
        
        // Verify that the client-provided ID was NOT used
        assertNotEquals(clientProvidedId, capturedAddress.getId(), 
            "Client-provided ID should be ignored and a server-generated ID should be used");
        
        // Verify that the userId matches the parameter
        assertEquals(testUserId, capturedAddress.getUserId(), 
            "UserId should match the parameter");
        
        // Verify that other fields are copied correctly
        assertEquals(dto.name, capturedAddress.getName());
        assertEquals(dto.phone, capturedAddress.getPhone());
        assertEquals(dto.addressLine, capturedAddress.getAddressLine());
    }

    @Test
    void createAddress_shouldGenerateIdEvenWhenClientIdIsNull() {
        // Arrange
        String testUserId = "user456";
        
        AddressDTO dto = new AddressDTO();
        dto.id = null; // Client does not provide ID
        dto.name = "Test Name";
        dto.phone = "1234567890";
        dto.addressLine = "123 Test St";
        dto.city = "City";
        dto.district = "District";
        dto.province = "Province";
        dto.postalCode = "12345";
        dto.isDefault = false;

        when(addressRepository.save(any(Address.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        AddressDTO result = profileService.createAddress(testUserId, dto);

        // Assert
        ArgumentCaptor<Address> addressCaptor = ArgumentCaptor.forClass(Address.class);
        verify(addressRepository).save(addressCaptor.capture());
        
        Address capturedAddress = addressCaptor.getValue();
        
        // Verify that an ID was generated
        assertNotNull(capturedAddress.getId(), "ID should be automatically generated");
        assertFalse(capturedAddress.getId().isEmpty(), "Generated ID should not be empty");
    }

    @Test
    void createAddress_generatedIdsShouldBeUnique() {
        // Arrange
        String testUserId = "user789";
        
        AddressDTO dto1 = new AddressDTO();
        dto1.name = "Address 1";
        dto1.phone = "1111111111";
        dto1.addressLine = "111 Test St";
        dto1.city = "City";
        dto1.district = "District";
        dto1.province = "Province";
        dto1.postalCode = "11111";
        dto1.isDefault = false;

        AddressDTO dto2 = new AddressDTO();
        dto2.name = "Address 2";
        dto2.phone = "2222222222";
        dto2.addressLine = "222 Test St";
        dto2.city = "City";
        dto2.district = "District";
        dto2.province = "Province";
        dto2.postalCode = "22222";
        dto2.isDefault = false;

        when(addressRepository.save(any(Address.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        AddressDTO result1 = profileService.createAddress(testUserId, dto1);
        AddressDTO result2 = profileService.createAddress(testUserId, dto2);

        // Assert
        ArgumentCaptor<Address> addressCaptor = ArgumentCaptor.forClass(Address.class);
        verify(addressRepository, times(2)).save(addressCaptor.capture());
        
        var capturedAddresses = addressCaptor.getAllValues();
        String id1 = capturedAddresses.get(0).getId();
        String id2 = capturedAddresses.get(1).getId();
        
        assertNotEquals(id1, id2, "Generated IDs should be unique for different addresses");
    }
}
