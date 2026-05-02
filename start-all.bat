@echo off
echo ========================================
echo Decode Age Task Manager
echo ========================================
echo.
echo Starting Backend and Frontend servers...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.

start "Backend Server" cmd /k "cd backend && npm.cmd run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo Both servers are starting in separate windows...
echo Close those windows to stop the servers.
echo.
pause
