$ErrorActionPreference = "Stop"

kubectl apply -f k8s/phase-2/namespace.yaml
kubectl apply -f k8s/phase-2/core-infra.yaml
kubectl apply -f k8s/phase-2/data-infra.yaml
kubectl apply -f k8s/phase-2/observability.yaml

Write-Host "Phase 2 Kubernetes infrastructure applied."
