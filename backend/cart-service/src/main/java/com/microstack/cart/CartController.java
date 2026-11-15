
package com.microstack.cart;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final Map<Long, CartItem> cart =
            new ConcurrentHashMap<>();

    // Get all cart items
    @GetMapping
    public List<CartItem> all() {
        return new ArrayList<>(cart.values());
    }

    // Add a product to cart
    @PostMapping
    public CartItem add(@RequestBody CartItem item) {

        if (item.productId() == null ||
            item.productName() == null ||
            item.quantity() < 1 ||
            item.unitPrice() < 0) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid cart item"
            );
        }

        return cart.compute(item.productId(), (id, existing) -> {

            if (existing == null) {
                return item;
            }

            return new CartItem(
                id,
                existing.productName(),
                existing.quantity() + item.quantity(),
                existing.unitPrice()
            );
        });
    }

    // Update product quantity
    @PutMapping("/{productId}")
    public CartItem update(
            @PathVariable Long productId,
            @RequestParam int quantity) {

        if (quantity < 1) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Quantity must be at least 1"
            );
        }

        CartItem existing = cart.get(productId);

        if (existing == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Product not found in cart"
            );
        }

        CartItem updated = new CartItem(
            existing.productId(),
            existing.productName(),
            quantity,
            existing.unitPrice()
        );

        cart.put(productId, updated);

        return updated;
    }

    // Remove product from cart
    @DeleteMapping("/{productId}")
    public void remove(@PathVariable Long productId) {
        cart.remove(productId);
    }
}
