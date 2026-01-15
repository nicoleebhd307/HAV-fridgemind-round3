# PowerShell helper script để test receipt
# Usage: .\test_receipt.ps1 -ImagePath "path/to/receipt.jpg" [-TestType "dhash"|"upload"|"both"]

param(
    [Parameter(Mandatory=$true)]
    [string]$ImagePath,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("dhash", "upload", "both")]
    [string]$TestType = "both",
    
    [Parameter(Mandatory=$false)]
    [int]$MaxDist = $null
)

# Check if we're in the right directory
if (-not (Test-Path "app\tools\test_dhash.py")) {
    Write-Host "❌ Error: Please run this script from apps/api directory" -ForegroundColor Red
    Write-Host "   Current directory: $PWD" -ForegroundColor Yellow
    exit 1
}

# Check if image exists
if (-not (Test-Path $ImagePath)) {
    Write-Host "❌ Error: Image not found: $ImagePath" -ForegroundColor Red
    exit 1
}

# Activate venv if exists
if (Test-Path ".venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Green
    & ".venv\Scripts\Activate.ps1"
}

# Set UTF-8 encoding for Python output to handle emoji characters
$env:PYTHONIOENCODING = "utf-8"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "RECEIPT TEST RUNNER" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "Image: $ImagePath" -ForegroundColor White
Write-Host "Test Type: $TestType" -ForegroundColor White
Write-Host ""

# Run test_dhash
if ($TestType -eq "dhash" -or $TestType -eq "both") {
    Write-Host "🧪 Running dHash Test..." -ForegroundColor Yellow
    Write-Host "-" * 70 -ForegroundColor Gray
    
    $dhashArgs = @("app.tools.test_dhash", "--image", $ImagePath)
    if ($MaxDist) {
        $dhashArgs += "--max-dist"
        $dhashArgs += $MaxDist.ToString()
    }
    
    python -m $dhashArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ dHash test failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
}

# Run test_upload
if ($TestType -eq "upload" -or $TestType -eq "both") {
    Write-Host "🧪 Running Upload Test..." -ForegroundColor Yellow
    Write-Host "-" * 70 -ForegroundColor Gray
    
    python -m app.tools.test_upload --image $ImagePath
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Upload test failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
}

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "✅ Tests completed!" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
