@echo off
echo Starting PG Renter Next.js Application...
echo.

REM Start the authentication server in the background
echo Starting authentication server on port 5001...
start /b "Auth Server" cmd /c "cd /d %~dp0 && npm run server"

REM Wait a bit for auth server to start
timeout /t 5 /nobreak >nul

REM Start the Next.js development server
echo Starting Next.js development server...
npm run dev

pause