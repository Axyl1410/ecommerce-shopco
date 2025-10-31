package shopco.backend.application.dto.profile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import shopco.backend.domain.enums.OrderStatus;

public class OrderSummaryDTO {
    public String id;
    public String code;
    public LocalDateTime createdAt;
    public BigDecimal total;
    public OrderStatus status;
    public Integer itemsCount;
}
