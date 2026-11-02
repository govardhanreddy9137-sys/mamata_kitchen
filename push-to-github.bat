@echo off
echo ===================================================
echo   Mamata Kitchen - Push to GitHub
echo ===================================================
echo.
cd /d "%~dp0"
git status
echo.
echo Pushing changes to https://github.com/govardhanreddy9137-sys/mamata_kitchen.git ...
git push -u origin main
echo.
if %errorlevel% neq 0 (
    echo [ERROR] Push failed. Make sure you are authenticated with GitHub.
) else (
    echo [SUCCESS] Successfully pushed to GitHub (mamata_kitchen)!
)
echo.
pause
