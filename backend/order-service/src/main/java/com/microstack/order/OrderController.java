
package com.microstack.order;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final ConcurrentHashMap<Long, Order> orders =
            new ConcurrentHashMap<>();

    private final AtomicLong orderIdGenerator =
            new AtomicLong(1000);

    private static final List<String> STATUSES = List.of(
            "PLACED",
            "CONFIRMED",
            "PACKED",
            "SHIPPED",
            "DELIVERED"
    );

    @GetMapping
    public List<Order> getAllOrders() {
        return new ArrayList<>(orders.values());
    }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {
        Order order = orders.get(id);

        if (order == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Order not found"
            );
        }

        return order;
    }

    @PostMapping
    public Order createOrder(@RequestBody OrderRequest request) {

        if (request.customerName() == null ||
                request.customerName().isBlank() ||
                request.phone() == null ||
                request.phone().isBlank() ||
                request.deliveryAddress() == null ||
                request.deliveryAddress().isBlank() ||
                request.items() == null ||
                request.items().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please provide customer details and order items"
            );
        }

        List<Order.Item> orderItems = new ArrayList<>();
        double subtotal = 0;

        for (OrderItemRequest item : request.items()) {

            if (item.productId() == null ||
                    item.productName() == null ||
                    item.productName().isBlank() ||
                    item.quantity() < 1 ||
                    item.unitPrice() < 0) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid order item"
                );
            }

            double lineTotal = round(
                    item.quantity() * item.unitPrice()
            );

            subtotal += lineTotal;

            orderItems.add(new Order.Item(
                    item.productId(),
                    item.productName(),
                    item.quantity(),
                    item.unitPrice(),
                    lineTotal,
                    item.image(),
                    item.category()
            ));
        }

        subtotal = round(subtotal);

        double deliveryCharge = subtotal >= 1000 ? 0 : 50;
        double total = round(subtotal + deliveryCharge);

        Long orderId = orderIdGenerator.incrementAndGet();
        LocalDateTime now = LocalDateTime.now();

        List<Order.TrackingEvent> history = new ArrayList<>();

        history.add(new Order.TrackingEvent(
                "PLACED",
                "Your order has been placed successfully",
                now
        ));

        Order order = new Order(
                orderId,
                request.customerName(),
                request.phone(),
                request.deliveryAddress(),
                orderItems,
                subtotal,
                deliveryCharge,
                total,
                "PLACED",
                now,
                history
        );

        orders.put(orderId, order);

        return order;
    }

    @PatchMapping("/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest request) {

        Order existing = getOrder(id);

        int currentIndex = STATUSES.indexOf(existing.status());
        int nextIndex = STATUSES.indexOf(request.status());

        if (nextIndex != currentIndex + 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Order status must move to the next tracking stage"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        List<Order.TrackingEvent> history =
                new ArrayList<>(existing.trackingHistory());

        String message = switch (request.status()) {
            case "CONFIRMED" -> "Your order has been confirmed";
            case "PACKED" -> "Your items have been packed";
            case "SHIPPED" -> "Your order has been shipped";
            case "DELIVERED" -> "Your order has been delivered";
            default -> "Order status updated";
        };

        history.add(new Order.TrackingEvent(
                request.status(),
                message,
                now
        ));

        Order updated = new Order(
                existing.id(),
                existing.customerName(),
                existing.phone(),
                existing.deliveryAddress(),
                existing.items(),
                existing.subtotal(),
                existing.deliveryCharge(),
                existing.total(),
                request.status(),
                existing.orderDate(),
                history
        );

        orders.put(id, updated);

        return updated;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    public record OrderRequest(
            String customerName,
            String phone,
            String deliveryAddress,
            List<OrderItemRequest> items
    ) {}

    public record OrderItemRequest(
            Long productId,
            String productName,
            int quantity,
            double unitPrice,
            String image,
            String category
    ) {}

    public record StatusRequest(String status) {}
}
