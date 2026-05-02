@echo off
echo ========================================
echo Decode Age Task Manager - Docker Setup
echo ========================================
echo.

echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    echo After installation:
    echo 1. Start Docker Desktop
    echo 2. Wait for it to fully start
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo Docker found!
echo.

echo Checking if Docker is running...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is installed but not running
    echo.
    echo Please start Docker Desktop and try again
    echo.
    pause
    exit /b 1
)

echo Docker is running!
echo.

echo Starting PostgreSQL container...
docker-compose up -d

if %errorlevel% neq 0 (
    echo ERROR: Failed to start PostgreSQL container
    pause
    exit /b 1
)

echo.
echo Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

echo.
echo Checking PostgreSQL health...
docker-compose ps

echo.
echo Running database migrations...
cd backend
call npm.cmd run migrate:up
if %errorlevel% neq 0 (
    echo ERROR: Migration failed!
    echo Please check your database connection
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo PostgreSQL is running in Docker container
echo Container name: decode_age_postgres
echo Database: decode_age_task_manager
echo Port: 5432
echo.
echo Admin credentials:
echo Email: pdev444444@gmail.com
echo Password: admin123
echo.
echo To start the application:
echo 1. Run: start-all.bat
echo 2. Open browser: http://localhost:5173
echo.
echo To stop PostgreSQL:
echo   docker-compose down
echo.
echo To view PostgreSQL logs:
echo   docker-compose logs -f postgres
echo.
pause
