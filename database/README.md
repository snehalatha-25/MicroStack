# Database plan

Install MySQL Server and MySQL Workbench in the database phase.

Suggested schemas:
- `microstack_products`
- `microstack_carts`
- `microstack_orders`

Keep service ownership separate: Product Service accesses product tables, Cart Service accesses cart tables, and Order Service accesses order tables. Never put database passwords in Git; use environment variables or Kubernetes Secrets.
