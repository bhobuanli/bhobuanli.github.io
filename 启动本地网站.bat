@echo off
cd /d "%~dp0"
echo Starting BHOBUANLI local website...
start "" http://localhost:3000
npm run dev -- --host 127.0.0.1
pause
