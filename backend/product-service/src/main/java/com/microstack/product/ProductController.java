
package com.microstack.product;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final List<Product> products = List.of(
        // Electronics
        new Product(1L, "Studio Headphones", "Electronics", 3499.0),
        new Product(4L, "Wireless Earbuds", "Electronics", 1999.0),
        new Product(5L, "Smart Watch", "Electronics", 2999.0),
        new Product(6L, "Bluetooth Speaker", "Electronics", 1499.0),
        new Product(7L, "Mechanical Keyboard", "Electronics", 2799.0),
        new Product(8L, "Wireless Mouse", "Electronics", 899.0),
        new Product(9L, "Portable Power Bank", "Electronics", 1299.0),
        new Product(10L, "HD Webcam", "Electronics", 1899.0),

        // Fashion
        new Product(11L, "Classic Cotton T-Shirt", "Fashion", 699.0),
        new Product(12L, "Casual Denim Jacket", "Fashion", 1999.0),
        new Product(13L, "Everyday Sneakers", "Fashion", 2499.0),
        new Product(14L, "Classic Wrist Watch", "Fashion", 1799.0),
        new Product(15L, "Polarized Sunglasses", "Fashion", 999.0),
        new Product(16L, "Leather Wallet", "Fashion", 799.0),
        new Product(17L, "Canvas Shoes", "Fashion", 1299.0),

        // Home
        new Product(3L, "Minimal Desk Lamp", "Home", 1599.0),
        new Product(18L, "Ceramic Coffee Mug", "Home", 399.0),
        new Product(19L, "Decorative Flower Vase", "Home", 899.0),
        new Product(20L, "Soft Cushion Set", "Home", 1199.0),
        new Product(21L, "Wall Clock", "Home", 799.0),
        new Product(22L, "Table Organizer", "Home", 599.0),
        new Product(23L, "Premium Bedsheet Set", "Home", 1899.0),
        new Product(24L, "Indoor Planter", "Home", 499.0),

        // Accessories
        new Product(2L, "Everyday Backpack", "Accessories", 2199.0),
        new Product(25L, "Travel Laptop Sleeve", "Accessories", 899.0),
        new Product(26L, "Reusable Water Bottle", "Accessories", 499.0),
        new Product(27L, "Travel Organizer", "Accessories", 699.0),
        new Product(28L, "Premium Notebook", "Accessories", 299.0),
        new Product(29L, "Desk Mat", "Accessories", 599.0),
        new Product(30L, "Compact Umbrella", "Accessories", 799.0)
    );

    @GetMapping
    public List<Product> all() {
        return products;
    }

    @GetMapping("/{id}")
    public Product one(@PathVariable Long id) {
        return products.stream()
            .filter(p -> p.id().equals(id))
            .findFirst()
            .orElseThrow();
    }
}
