$ErrorActionPreference = "Stop"

kubectl delete -f k8s/phase2/observability.yaml --ignore-not-found
kubectl delete -f k8s/phase2/data-infra.yaml --ignore-not-found
kubectl delete -f k8s/phase2/core-infra.yaml --ignore-not-found
kubectl delete -f k8s/phase2/namespace.yaml --ignore-not-found

Write-Host "Phase 2 Kubernetes infrastructure removed."
