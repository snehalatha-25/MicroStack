# MicroStack

A starter microservices-based e-commerce platform with a React storefront and Spring Boot services.

## Stack
- React + Vite frontend
- Java 21 + Spring Boot + Maven
- Product, Cart and Order services
- Docker / Docker Compose
- Jenkins pipeline starter
- Kubernetes manifests (image names must be updated before deployment)

## Current starter scope
The frontend is a demo storefront. The backend services expose sample in-memory endpoints.
MySQL persistence, API Gateway, authentication, and full frontend-to-backend integration are planned next.

## Run locally
### Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

### Backend services
Install JDK 21 and Maven, then in each service folder:
```powershell
mvn spring-boot:run
```
- Product service: http://localhost:8081/api/products
- Cart service: http://localhost:8082/api/cart
- Order service: http://localhost:8083/api/orders

### Docker Compose
From the project root:
```powershell
docker compose -f docker/compose.yaml up --build
```
Frontend: http://localhost:5173

## Before Kubernetes
1. Build and push images to a registry.
2. Replace `YOUR_DOCKERHUB_USERNAME` in `kubernetes/*.yaml`.
3. Apply manifests with `kubectl apply -f kubernetes/`.
4. Check with `kubectl get pods,services`.

## Important
This is a learning starter, not a production-ready commerce system. Checkout is simulated; no real payment processing is included.
