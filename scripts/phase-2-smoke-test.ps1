$ErrorActionPreference = "Stop"

$checks = @(
    @{ Name = "gateway-health"; Type = "http"; Uri = "http://127.0.0.1:3000/health" },
    @{ Name = "gateway-readiness"; Type = "http"; Uri = "http://127.0.0.1:3000/readiness" },
    @{ Name = "gateway-liveness"; Type = "http"; Uri = "http://127.0.0.1:3000/liveness" },
    @{ Name = "consul"; Type = "http"; Uri = "http://127.0.0.1:8500/v1/status/leader" },
    @{ Name = "rabbitmq-management"; Type = "http"; Uri = "http://127.0.0.1:15672" },
    @{ Name = "postgres"; Type = "tcp"; Host = "127.0.0.1"; Port = 5432 },
    @{ Name = "mongodb"; Type = "tcp"; Host = "127.0.0.1"; Port = 27017 },
    @{ Name = "redis"; Type = "tcp"; Host = "127.0.0.1"; Port = 6379 },
    @{ Name = "elasticsearch"; Type = "http"; Uri = "http://127.0.0.1:9200" },
    @{ Name = "neo4j"; Type = "http"; Uri = "http://127.0.0.1:7474" },
    @{ Name = "clickhouse"; Type = "http"; Uri = "http://127.0.0.1:8123" },
    @{ Name = "minio"; Type = "http"; Uri = "http://127.0.0.1:9003" },
    @{ Name = "vault"; Type = "http"; Uri = "http://127.0.0.1:8200/v1/sys/health" },
    @{ Name = "prometheus"; Type = "http"; Uri = "http://127.0.0.1:9090/-/ready" },
    @{ Name = "alertmanager"; Type = "http"; Uri = "http://127.0.0.1:9093/-/ready" },
    @{ Name = "grafana"; Type = "http"; Uri = "http://127.0.0.1:3001/api/health" },
    @{ Name = "jaeger"; Type = "http"; Uri = "http://127.0.0.1:16686" },
    @{ Name = "loki"; Type = "http"; Uri = "http://127.0.0.1:3100/ready" }
)

$failures = @()

foreach ($check in $checks) {
    try {
        if ($check.Type -eq "http") {
            $response = Invoke-WebRequest -Uri $check.Uri -TimeoutSec 10 -UseBasicParsing
            if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 500) {
                throw "HTTP $($response.StatusCode)"
            }
        }
        elseif ($check.Type -eq "tcp") {
            $tcpResult = Test-NetConnection -ComputerName $check.Host -Port $check.Port -WarningAction SilentlyContinue
            if (-not $tcpResult.TcpTestSucceeded) {
                throw "TCP connection failed for $($check.Host):$($check.Port)"
            }
        }
        else {
            throw "Unsupported check type '$($check.Type)'"
        }

        Write-Host "$($check.Name) OK"
    }
    catch {
        $failures += "$($check.Name): $($_.Exception.Message)"
        Write-Host "$($check.Name) FAIL"
    }
}

if ($failures.Count -gt 0) {
    Write-Host ""
    Write-Host "Phase 2 smoke test failed:"
    foreach ($failure in $failures) {
        Write-Host "- $failure"
    }
    exit 1
}

Write-Host ""
Write-Host "Phase 2 smoke test passed."
