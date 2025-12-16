package shopco.backend.application.dto.admin;

/**
 * Response DTO for bulk operations
 */
public class BulkActionResponse {
    private boolean success;
    private String message;
    private int affectedCount;

    public BulkActionResponse() {
    }

    public BulkActionResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public BulkActionResponse(boolean success, String message, int affectedCount) {
        this.success = success;
        this.message = message;
        this.affectedCount = affectedCount;
    }

    public static BulkActionResponse success(String message, int affectedCount) {
        return new BulkActionResponse(true, message, affectedCount);
    }

    public static BulkActionResponse error(String message) {
        return new BulkActionResponse(false, message, 0);
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

    public int getAffectedCount() {
        return affectedCount;
    }

    public void setAffectedCount(int affectedCount) {
        this.affectedCount = affectedCount;
    }
}
