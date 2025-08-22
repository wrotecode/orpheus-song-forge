@echo off
echo 🎵 Starting Orpheus Backend...

REM Create directories
if not exist "data" mkdir data
if not exist "uploads" mkdir uploads

REM Try to use Visual Studio environment
set "VSWHERE=%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"
if exist "%VSWHERE%" (
    echo 🔧 Setting up build environment...
    for /f "usebackq tokens=*" %%i in (`"%VSWHERE%" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`) do (
        set "VSINSTALLPATH=%%i"
    )
    
    if defined VSINSTALLPATH (
        if exist "%VSINSTALLPATH%\VC\Auxiliary\Build\vcvarsall.bat" (
            echo ✅ Found Visual Studio Build Tools
            call "%VSINSTALLPATH%\VC\Auxiliary\Build\vcvarsall.bat" x64 >nul
            echo 🔨 Building...
            cargo build
            if not errorlevel 1 (
                echo ✅ Build successful!
                echo 🚀 Starting server on http://localhost:3000
                echo Press Ctrl+C to stop
                cargo run
                goto :end
            )
        )
    )
)

echo ⚠️  Trying without Visual Studio environment...
cargo build
if not errorlevel 1 (
    echo ✅ Build successful!
    cargo run
) else (
    echo ❌ Build failed
    echo Please install Visual Studio Build Tools 2022 with C++ workload
    echo See QUICK_START.md for instructions
    pause
)

:end
