
package com.microstack.order;

import java.time.LocalDateTime;
import java.util.List;

public record Order(
    Long id,
    String customerName,
    String phone,
    String deliveryAddress,
    List<Item> items,
    double subtotal,
    double deliveryCharge,
    double total,
    String status,
    LocalDateTime orderDate,
    List<TrackingEvent> trackingHistory
) {
    public record Item(
        Long productId,
        String productName,
        int quantity,
        double unitPrice,
        double lineTotal,
        String image,
        String category
    ) {}

    public record TrackingEvent(
        String status,
        String message,
        LocalDateTime timestamp
    ) {}
}
