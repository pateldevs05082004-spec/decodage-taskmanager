@echo off
echo ========================================
echo Docker PostgreSQL Management
echo ========================================
echo.
echo 1. Start PostgreSQL
echo 2. Stop PostgreSQL
echo 3. Restart PostgreSQL
echo 4. View logs
echo 5. Check status
echo 6. Connect to PostgreSQL (psql)
echo 7. Remove PostgreSQL (delete data)
echo 8. Exit
echo.
set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto status
if "%choice%"=="6" goto connect
if "%choice%"=="7" goto remove
if "%choice%"=="8" goto end

echo Invalid choice!
pause
goto end

:start
echo Starting PostgreSQL...
docker-compose up -d
echo PostgreSQL started!
pause
goto end

:stop
echo Stopping PostgreSQL...
docker-compose down
echo PostgreSQL stopped!
pause
goto end

:restart
echo Restarting PostgreSQL...
docker-compose restart
echo PostgreSQL restarted!
pause
goto end

:logs
echo Showing PostgreSQL logs (Press Ctrl+C to exit)...
docker-compose logs -f postgres
goto end

:status
echo PostgreSQL Status:
docker-compose ps
echo.
echo Container Details:
docker ps --filter name=decode_age_postgres
pause
goto end

:connect
echo Connecting to PostgreSQL...
echo (Password: postgres)
docker exec -it decode_age_postgres psql -U postgres -d decode_age_task_manager
goto end

:remove
echo WARNING: This will delete all data!
set /p confirm="Are you sure? (yes/no): "
if not "%confirm%"=="yes" (
    echo Cancelled.
    pause
    goto end
)
echo Removing PostgreSQL container and data...
docker-compose down -v
echo PostgreSQL removed!
pause
goto end

:end
