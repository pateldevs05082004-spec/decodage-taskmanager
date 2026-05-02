@echo off
echo ========================================
echo Decode Age Task Manager - Database Setup
echo ========================================
echo.

echo Checking PostgreSQL installation...
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo.
    echo Please install PostgreSQL from:
    echo https://www.postgresql.org/download/windows/
    echo.
    echo After installation, add PostgreSQL bin directory to PATH
    echo Default location: C:\Program Files\PostgreSQL\16\bin
    echo.
    pause
    exit /b 1
)

echo PostgreSQL found!
echo.

echo Creating database...
psql -U postgres -c "CREATE DATABASE decode_age_task_manager;" 2>nul
if %errorlevel% equ 0 (
    echo Database created successfully!
) else (
    echo Database might already exist or there was an error.
    echo Continuing anyway...
)
echo.

echo Running migrations...
cd backend
call npm.cmd run migrate:up
if %errorlevel% neq 0 (
    echo ERROR: Migration failed!
    echo Please check your database connection settings in .env file
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Admin credentials:
echo Email: pdev444444@gmail.com
echo Password: admin123
echo.
echo To start the application:
echo 1. Open terminal 1: cd backend ^&^& npm.cmd run dev
echo 2. Open terminal 2: cd frontend ^&^& npm.cmd run dev
echo 3. Open browser: http://localhost:5173
echo.
pause
