package com.microstack.product;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
  private final List<Product> products = List.of(
    new Product(1L, "Studio Headphones", "Electronics", 3499.0),
    new Product(2L, "Everyday Backpack", "Accessories", 2199.0),
    new Product(3L, "Minimal Desk Lamp", "Home", 1599.0)
  );
  @GetMapping public List<Product> all() { return products; }
  @GetMapping("/{id}") public Product one(@PathVariable Long id) {
    return products.stream().filter(p -> p.id().equals(id)).findFirst().orElseThrow();
  }
}
