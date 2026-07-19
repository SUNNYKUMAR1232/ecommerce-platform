$ErrorActionPreference = "Stop"

Write-Host "Starting Phase 2 infrastructure and services..."
docker compose --env-file .env -f docker-compose.yml -f docker-compose.phase-2.yml up -d --build

Write-Host ""
Write-Host "Phase 2 stack started."
Write-Host "Run: npm run test:phase-2"
