package shopco.backend.application.dto;

public class PaginationDto {

    private int page;
    private int limit;
    private long totalCount;
    private int totalPages;
    private boolean hasNextPage;
    private boolean hasPrevPage;

    public PaginationDto() {
    }

    public PaginationDto(int page, int limit, long totalCount) {
        this.page = page;
        this.limit = limit;
        this.totalCount = totalCount;
        this.totalPages = (int) Math.ceil((double) totalCount / limit);
        this.hasNextPage = page < totalPages;
        this.hasPrevPage = page > 1;
    }

    // Getters and Setters
    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public boolean isHasNextPage() {
        return hasNextPage;
    }

    public void setHasNextPage(boolean hasNextPage) {
        this.hasNextPage = hasNextPage;
    }

    public boolean isHasPrevPage() {
        return hasPrevPage;
    }

    public void setHasPrevPage(boolean hasPrevPage) {
        this.hasPrevPage = hasPrevPage;
    }
}
