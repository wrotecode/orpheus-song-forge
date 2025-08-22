@echo off
echo 🎵 Starting Orpheus Backend Server...
echo.

REM Check if cargo is available
cargo --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Cargo not found. Please install Rust first.
    pause
    exit /b 1
)

REM Create necessary directories
if not exist "data" mkdir data
if not exist "uploads" mkdir uploads

echo 🔧 Building project...
cargo build
if errorlevel 1 (
    echo.
    echo ❌ Build failed! Please check the QUICK_START.md guide for setup instructions.
    echo    Most likely you need to install Visual Studio Build Tools.
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo 🚀 Starting server on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

cargo run
