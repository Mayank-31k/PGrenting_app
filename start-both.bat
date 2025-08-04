@echo off
echo Killing existing processes...
taskkill /F /IM node.exe 2>nul

echo Waiting for processes to stop...
timeout /t 3 /nobreak >nul

echo Starting auth server...
cd /d "C:\Users\MAYANK\OneDrive\Desktop\pgRenter"
start /min cmd /c "node auth-server.js"

echo Waiting for auth server to start...
timeout /t 5 /nobreak >nul

echo Starting React app...
set PORT=3007
set BROWSER=none
"C:\Program Files\nodejs\node.exe" "./node_modules/react-scripts/scripts/start.js"