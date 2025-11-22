# PowerShell Script to Start All Backend Services
# Run this script to start all services without Docker

Write-Host "Starting all backend services..." -ForegroundColor Green
Write-Host ""

# Array of services
$services = @(
    @{Name="backend-auth"; Port=5000},
    @{Name="backend-products"; Port=5001},
    @{Name="backend-receipt"; Port=5002},
    @{Name="backend-deliveries"; Port=5003},
    @{Name="backend-transfer"; Port=5004},
    @{Name="backend-adjustment"; Port=5005},
    @{Name="backend-dashboard"; Port=5006}
)

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($mongoTest.TcpTestSucceeded) {
        Write-Host "MongoDB is running on port 27017" -ForegroundColor Green
    } else {
        Write-Host "WARNING: MongoDB might not be running on port 27017" -ForegroundColor Red
        Write-Host "Please start MongoDB first: net start MongoDB" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Could not verify MongoDB. Please ensure it's running." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Creating .env files if they don't exist..." -ForegroundColor Yellow

# Create .env files from env.example if they don't exist
foreach ($service in $services) {
    $envExample = "$($service.Name)\env.example"
    $envFile = "$($service.Name)\.env"
    
    if (Test-Path $envExample) {
        if (-not (Test-Path $envFile)) {
            Copy-Item $envExample $envFile
            Write-Host "Created $envFile" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Installing dependencies for all services..." -ForegroundColor Yellow

# Install dependencies for each service
foreach ($service in $services) {
    if (Test-Path $service.Name) {
        Write-Host "Installing dependencies for $($service.Name)..." -ForegroundColor Cyan
        Set-Location $service.Name
        if (Test-Path "package.json") {
            npm install --silent
        }
        Set-Location ..
    }
}

Write-Host ""
Write-Host "Starting services in separate windows..." -ForegroundColor Yellow
Write-Host "Each service will open in a new PowerShell window" -ForegroundColor Yellow
Write-Host ""

# Start each service in a new window
foreach ($service in $services) {
    if (Test-Path $service.Name) {
        Write-Host "Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Cyan
        
        $scriptBlock = @"
            `$host.UI.RawUI.WindowTitle = '$($service.Name) - Port $($service.Port)'
            Set-Location '$PWD\$($service.Name)'
            Write-Host 'Starting $($service.Name) on port $($service.Port)...' -ForegroundColor Green
            npm start
            Write-Host 'Press any key to close...' -ForegroundColor Yellow
            `$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
"@
        
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $scriptBlock
        Start-Sleep -Seconds 2
    }
}

Write-Host ""
Write-Host "All services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Services will be available on:" -ForegroundColor Yellow
foreach ($service in $services) {
    Write-Host "  - $($service.Name): http://localhost:$($service.Port)/health" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "To stop services, close the PowerShell windows for each service." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

