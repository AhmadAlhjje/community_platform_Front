@echo off
echo ================================
echo Testing Community Platform Build
echo ================================
echo.

echo [1/4] Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies OK
)
echo.

echo [2/4] Checking environment file...
if not exist .env.local (
    echo Creating .env.local from example...
    copy .env.local.example .env.local
) else (
    echo .env.local OK
)
echo.

echo [3/4] Building project...
call npm run build
echo.

if %ERRORLEVEL% EQU 0 (
    echo ================================
    echo BUILD SUCCESSFUL!
    echo ================================
    echo.
    echo You can now run:
    echo   npm start     - for production
    echo   npm run dev   - for development
    echo.
) else (
    echo ================================
    echo BUILD FAILED!
    echo ================================
    echo Check the errors above
    echo.
)

pause
