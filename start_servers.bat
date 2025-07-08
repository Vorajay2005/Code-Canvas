@echo off
echo Starting CodeCanvas Development Servers...
echo.

echo Starting PHP Backend Server...
start "PHP Backend" cmd /c "php -S localhost:8000 -t public/ && pause"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting React Frontend Server...
start "React Frontend" cmd /c "npm run dev && pause"

echo.
echo ========================================
echo CodeCanvas Development Servers Started
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo.
echo Press any key to continue...
pause > nul