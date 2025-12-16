package shopco.backend.application.dto.admin;

/**
 * Generic response DTO for admin product operations
 */
public class AdminProductResponse {
    private boolean success;
    private String message;
    private AdminProductDto product;

    public AdminProductResponse() {
    }

    public AdminProductResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public AdminProductResponse(boolean success, String message, AdminProductDto product) {
        this.success = success;
        this.message = message;
        this.product = product;
    }

    public static AdminProductResponse success(String message) {
        return new AdminProductResponse(true, message);
    }

    public static AdminProductResponse success(String message, AdminProductDto product) {
        return new AdminProductResponse(true, message, product);
    }

    public static AdminProductResponse error(String message) {
        return new AdminProductResponse(false, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AdminProductDto getProduct() {
        return product;
    }

    public void setProduct(AdminProductDto product) {
        this.product = product;
    }
}
