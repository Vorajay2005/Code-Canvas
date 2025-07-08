@echo off
echo Starting PHP Backend Server...
echo.
echo Server will start on: http://localhost:8000
echo API endpoints available:
echo - POST /generate-code
echo - POST /recognize-shapes  
echo - POST /analyze-flowchart
echo.
echo Press Ctrl+C to stop the server
echo.

php -S localhost:8000 -t public/ -d display_errors=1 -d log_errors=1