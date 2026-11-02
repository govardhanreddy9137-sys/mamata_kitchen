@echo off
echo ===================================================
echo   Mamata Tiffins - Push to GitHub
echo ===================================================
echo.
cd /d "%~dp0"
git status
echo.
echo Pushing changes to https://github.com/govardhanreddy9137-sys/mamata-tiffins.git ...
git push -u origin main
echo.
if %errorlevel% neq 0 (
    echo [ERROR] Push failed. Make sure you created the repository on GitHub:
    echo https://github.com/new (Name: mamata-tiffins)
    echo And that you are authenticated with GitHub.
) else (
    echo [SUCCESS] Successfully pushed to GitHub (mamata-tiffins)!
)
echo.
pause
