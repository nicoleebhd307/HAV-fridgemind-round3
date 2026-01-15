# PowerShell script to run the FastAPI server on Windows
# Usage: .\run.ps1

# Change to the API directory
Set-Location $PSScriptRoot

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
& ".venv\Scripts\Activate.ps1"

# Check if requirements are installed
$uvicornInstalled = & ".venv\Scripts\python.exe" -m pip show uvicorn 2>$null
if (-not $uvicornInstalled) {
    Write-Host "Installing requirements..." -ForegroundColor Yellow
    & ".venv\Scripts\python.exe" -m pip install -r requirements.txt
}

# Run uvicorn
Write-Host "Starting FastAPI server..." -ForegroundColor Green
& ".venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000
