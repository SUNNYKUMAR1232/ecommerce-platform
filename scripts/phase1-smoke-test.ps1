$ErrorActionPreference = "Stop"

$services = @(
    @{ Name = "gateway"; Port = 3000 },
    @{ Name = "auth-service"; Port = 8081 },
    @{ Name = "user-service"; Port = 8082 },
    @{ Name = "product-service"; Port = 8083 },
    @{ Name = "inventory-service"; Port = 8084 },
    @{ Name = "cart-service"; Port = 8085 },
    @{ Name = "order-service"; Port = 8086 },
    @{ Name = "payment-service"; Port = 8087 },
    @{ Name = "shipping-service"; Port = 8088 },
    @{ Name = "review-service"; Port = 8089 },
    @{ Name = "notification-service"; Port = 8090 },
    @{ Name = "search-service"; Port = 8091 },
    @{ Name = "recommendation-service"; Port = 8092 },
    @{ Name = "analytics-service"; Port = 8093 }
)

$failures = @()

foreach ($service in $services) {
    $name = $service.Name
    $port = $service.Port
    $uri = "http://127.0.0.1:$port/health"

    try {
        $response = Invoke-RestMethod -Uri $uri -TimeoutSec 10
        if ($response.status -ne "ok" -or $response.service -ne $name) {
            $failures += "$name returned unexpected payload: $($response | ConvertTo-Json -Compress)"
            Write-Host "$name [$port] FAIL"
            continue
        }

        Write-Host "$name [$port] OK"
    }
    catch {
        $failures += "$name [$port] $($_.Exception.Message)"
        Write-Host "$name [$port] FAIL"
    }
}

if ($failures.Count -gt 0) {
    Write-Host ""
    Write-Host "Phase 1 smoke test failed:"
    foreach ($failure in $failures) {
        Write-Host "- $failure"
    }
    exit 1
}

Write-Host ""
Write-Host "Phase 1 smoke test passed."
