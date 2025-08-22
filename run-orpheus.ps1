Write-Host "🎵 Orpheus Backend Launcher" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Create directories
if (!(Test-Path "data")) { New-Item -ItemType Directory -Path "data" -Force | Out-Null }
if (!(Test-Path "uploads")) { New-Item -ItemType Directory -Path "uploads" -Force | Out-Null }

Write-Host "🔨 Attempting to build..." -ForegroundColor Yellow

# Try with Visual Studio environment first
$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
if (Test-Path $vswhere) {
    $installPath = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
    if ($installPath) {
        $vcvarsall = "$installPath\VC\Auxiliary\Build\vcvarsall.bat"
        if (Test-Path $vcvarsall) {
            Write-Host "✅ Using Visual Studio Build Tools" -ForegroundColor Green
            cmd /c "`"$vcvarsall`" x64 >nul 2>nul && cargo build"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Build successful!" -ForegroundColor Green
                Write-Host "🚀 Starting server on http://localhost:3000" -ForegroundColor Cyan
                cmd /c "`"$vcvarsall`" x64 >nul 2>nul && cargo run"
                exit
            }
        }
    }
}

# Fallback to regular cargo
Write-Host "⚠️  Trying regular cargo build..." -ForegroundColor Yellow
cargo build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    cargo run
} else {
    Write-Host "❌ Build failed. Please install Visual Studio Build Tools." -ForegroundColor Red
    Write-Host "See QUICK_START.md for instructions." -ForegroundColor White
}
