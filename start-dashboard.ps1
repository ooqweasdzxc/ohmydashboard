$host.UI.RawUI.WindowTitle = "OhMyDashboard Server"

Write-Host ""
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host "  OhMyDashboard - SQLite Version" -ForegroundColor Cyan  
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Server: http://127.0.0.1:51234" -ForegroundColor Green
Write-Host "  Data:   ~/.local/share/opencode/opencode.db" -ForegroundColor Gray
Write-Host ""
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

Set-Location $PSScriptRoot

Start-Process "http://127.0.0.1:51234"

bun bin/cli.ts --port 51234

Write-Host ""
Write-Host "  Server stopped." -ForegroundColor Gray