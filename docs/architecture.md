# Architecture

Browser -> React frontend -> (planned) API Gateway -> Product / Cart / Order services.

- Product Service owns product catalogue operations.
- Cart Service owns cart operations.
- Order Service owns order creation and tracking.
- Each service will later own its own MySQL schema.
- Docker packages each component.
- Jenkins automates build/test/image stages.
- Kubernetes runs and manages containers.

The starter currently exposes sample in-memory data. Add persistence and gateway integration in later phases.
