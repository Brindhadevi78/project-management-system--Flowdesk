@echo off
echo Starting PRO.KI Project Management System...
echo.
echo Starting Backend Server...
start cmd /k "cd /d %~dp0 && npm run server"
timeout /t 2 /nobreak >nul
echo.
echo Starting Frontend...
start cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
pause
