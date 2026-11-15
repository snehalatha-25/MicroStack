# Suggested team workflow

1. Create a GitHub repository and protect the `main` branch.
2. Give each member a feature branch, e.g. `feature/product-service`.
3. Commit small changes with clear messages.
4. Open pull requests and review before merging.
5. Keep API contracts in `docs/api-contracts.md`.
6. One member owns integration and release coordination.

Suggested split:
- Member 1: React frontend
- Member 2: Product Service
- Member 3: Cart and Order services
- Member 4: Docker, Jenkins and GitHub workflow
- Member 5 (if available): Kubernetes, testing and documentation

For a four-person team, share Kubernetes and integration between members 3 and 4.
