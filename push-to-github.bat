@echo off
echo ===================================================
echo   Mamata Tiffin Center - Push to GitHub
echo ===================================================
echo.
cd /d "%~dp0"
git status
echo.
echo Pushing changes to GitHub repository...
git push -u origin main
echo.
if %errorlevel% neq 0 (
    echo [ERROR] Push failed. Make sure you created the repository on GitHub:
    echo https://github.com/new (Name: tiffin-billing-system)
    echo And that you are authenticated with GitHub.
) else (
    echo [SUCCESS] Successfully pushed to GitHub!
)
echo.
pause
