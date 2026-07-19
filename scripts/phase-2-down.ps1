$ErrorActionPreference = "Stop"

Write-Host "Stopping Phase 2 infrastructure and services..."
docker compose --env-file .env -f docker-compose.yml -f docker-compose.phase-2.yml down

Write-Host ""
Write-Host "Phase 2 stack stopped."
