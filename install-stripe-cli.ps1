# Install Stripe CLI on Windows

Write-Host "Descargando Stripe CLI..." -ForegroundColor Cyan

$ProgressPreference = 'SilentlyContinue'
$url = "https://github.com/stripe/stripe-cli/releases/download/v1.19.1/stripe_1.19.1_windows_x86_64.zip"
$output = "$env:TEMP\stripe_cli.zip"
$extractPath = "$env:LOCALAPPDATA\stripe-cli"

# Descargar
try {
    Invoke-WebRequest -Uri $url -OutFile $output
    Write-Host "✅ Descargado" -ForegroundColor Green
} catch {
    Write-Host "❌ Error descargando: $_" -ForegroundColor Red
    exit 1
}

# Extraer
try {
    Expand-Archive -Path $output -DestinationPath $extractPath -Force
    Write-Host "✅ Extraído" -ForegroundColor Green
} catch {
    Write-Host "❌ Error extrayendo: $_" -ForegroundColor Red
    exit 1
}

# Agregar a PATH
$stripe_path = "$extractPath"
$env:PATH = "$stripe_path;$env:PATH"

Write-Host "`n✅ Stripe CLI instalado correctamente" -ForegroundColor Green
Write-Host "`nAhora ejecuta en PowerShell:" -ForegroundColor Yellow
Write-Host "stripe login" -ForegroundColor Magenta
Write-Host "stripe listen --forward-to localhost:3000/api/stripe/webhook" -ForegroundColor Magenta
