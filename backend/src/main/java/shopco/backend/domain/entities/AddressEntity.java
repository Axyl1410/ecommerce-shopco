package shopco.backend.domain.entities;

import java.time.LocalDateTime;

public class AddressEntity {
    private String id;
    private String userId;
    private String name;
    private String phone;
    private String addressLine;
    private String city;
    private String district;
    private String province;
    private String postalCode;
    private Boolean isDefault;
    private LocalDateTime createdAt;

    public AddressEntity(String id, String userId, String name, String phone, 
            String addressLine, String city, String district, String province,
            String postalCode, Boolean isDefault, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.phone = phone;
        this.addressLine = addressLine;
        this.city = city;
        this.district = district;
        this.province = province;
        this.postalCode = postalCode;
        this.isDefault = isDefault;
        this.createdAt = createdAt;
    }
    
    public AddressEntity() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}