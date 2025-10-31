package shopco.backend.application.dto.profile;

import java.time.LocalDateTime;

public class AddressDTO {
    public String id;
    public String userId;
    public String name;
    public String phone;
    public String addressLine;
    public String city;
    public String district;
    public String province;
    public String postalCode;
    public Boolean isDefault;
    public LocalDateTime createdAt;

    public AddressDTO() {}
}
