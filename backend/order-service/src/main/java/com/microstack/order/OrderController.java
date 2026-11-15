package com.microstack.order;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
  private final List<Order> orders = new CopyOnWriteArrayList<>(List.of(new Order(1001L, "DEMO", 3499.0)));
  @GetMapping public List<Order> all() { return orders; }
  @PostMapping public Order create(@RequestBody OrderRequest request) {
    Order order = new Order(System.currentTimeMillis(), "PLACED", request.total());
    orders.add(order); return order;
  }
  public record OrderRequest(double total) {}
}
