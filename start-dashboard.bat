@echo off
echo.
echo   ========================================
echo   OhMyDashboard - SQLite Version
echo   ========================================
echo.
echo   Starting server on port 51234...
echo   Press Ctrl+C to stop
echo.
cd /d "%~dp0"
bun bin/cli.ts --port 51234
echo.
echo   Server stopped.
pause