# Deployment Architecture

  * **Strategy:** Frontend static assets and backend BFF deployed as separate, containerized services on Fly.io.
  * **CI/CD:** A GitHub Actions pipeline will automate linting, testing, building, and deploying on pushes to the `main` branch.
