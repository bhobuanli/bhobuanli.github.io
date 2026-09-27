@echo off
setlocal
chcp 65001 >nul
set "ROOT=%~dp0..\.."
cd /d "%ROOT%"

echo [1/4] Syncing X posts...
call npm run sync:x
if errorlevel 1 goto :error

echo [2/4] Staging changes...
git add .
if errorlevel 1 goto :error

git diff --cached --quiet
if errorlevel 1 goto :commit

echo No changes to commit.
goto :push

:commit
set "COMMIT_MSG="
set /p "COMMIT_MSG=Commit message: "
if "%COMMIT_MSG%"=="" (
  echo Commit cancelled: no message entered.
  goto :end
)

echo [3/4] Committing...
git commit -m "%COMMIT_MSG%"
if errorlevel 1 goto :error

:push
echo [4/4] Pushing...
git push
if errorlevel 1 goto :error

echo.
echo Commit and push complete.
goto :end

:error
echo.
echo Command failed. See the output above.
echo If push failed because there is no upstream, run:
echo   git push -u origin main

:end
echo.
pause
