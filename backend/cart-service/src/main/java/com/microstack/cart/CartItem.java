package com.microstack.cart;

public record CartItem(
    Long productId,
    String productName,
    int quantity,
    double unitPrice
) {
}
