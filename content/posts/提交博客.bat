@echo off
setlocal
chcp 65001 >nul
set "ROOT=%~dp0..\.."
cd /d "%ROOT%"

echo [1/3] Syncing X posts...
call npm run sync:x
if errorlevel 1 goto :error

echo [2/3] Staging changes...
git add .
if errorlevel 1 goto :error

git diff --cached --quiet
if not errorlevel 1 (
  echo No changes to commit.
  goto :end
)

set "COMMIT_MSG="
set /p "COMMIT_MSG=Commit message: "
if "%COMMIT_MSG%"=="" (
  echo Commit cancelled: no message entered.
  goto :end
)

echo [3/3] Committing...
git commit -m "%COMMIT_MSG%"
if errorlevel 1 goto :error

echo.
echo Commit complete.
goto :end

:error
echo.
echo Command failed. See the output above.

:end
echo.
pause
