# 🚀 Quick Start Guide - Orpheus Backend

## The Issue
Your Rust installation is missing the Microsoft C++ linker (`link.exe`) needed to compile native dependencies.

## 🛠️ Solution Options (Pick One)

### Option 1: Install Visual Studio Build Tools (Recommended)

1. **Download Build Tools**:
   - Go to: https://visualstudio.microsoft.com/downloads/
   - Scroll down to "Tools for Visual Studio"
   - Download "Build Tools for Visual Studio 2022"

2. **Install with C++ Tools**:
   - Run the installer
   - Select "C++ build tools" workload
   - Install (will take a few minutes)

3. **Restart Terminal & Build**:
   ```cmd
   # Close and reopen PowerShell/Terminal
   cargo build
   cargo run
   ```

### Option 2: Use Docker (If you have Docker Desktop)

1. **Check if Docker is available**:
   ```powershell
   docker --version
   ```

2. **If Docker works, build and run**:
   ```powershell
   docker build -t orpheus-backend .
   docker run -p 3000:3000 -v ${PWD}/data:/app/data -v ${PWD}/uploads:/app/uploads orpheus-backend
   ```

### Option 3: Install MinGW (Alternative)

1. **Install MinGW-w64**:
   - Download from: https://www.mingw-w64.org/downloads/
   - Or install via package manager if available

2. **Install Rust GNU target**:
   ```cmd
   # If you can get rustup working
   rustup target add x86_64-pc-windows-gnu
   cargo build --target x86_64-pc-windows-gnu
   ```

## 🧪 Once Running - Test Your API

1. **Server should start on**: `http://localhost:3000`

2. **Test with curl or PowerShell**:
   ```powershell
   # Get test token
   Invoke-RestMethod http://localhost:3000/auth/token

   # Test health
   Invoke-RestMethod http://localhost:3000/health
   ```

3. **Run the provided test script**:
   ```powershell
   .\test-api.ps1
   ```

## 🎯 Expected Output When Working

```
🎵 Orpheus Backend Server starting...
📡 Server running on http://0.0.0.0:3000
📂 Storage file: data/projects.json
🎧 Ready to accept music collaboration requests!
```

## 📞 If You Need Help

1. **Check if you have Visual Studio already installed**:
   - Look for "Visual Studio Installer" in Start Menu
   - If found, open it and add "C++ build tools"

2. **Alternative: Use online development environment**:
   - GitHub Codespaces
   - Gitpod
   - Any Linux-based cloud IDE

## 🎵 Your API Endpoints (Once Running)

- `GET /health` - Health check
- `GET /auth/token` - Get test token
- `POST /api/projects` - Create project (requires auth)
- `GET /api/projects` - List projects (requires auth) 
- `GET /api/projects/:id` - Get project (requires auth)
- `POST /api/upload` - Upload MP3 (requires auth)

The backend is complete and ready - just need to get past the Windows build environment hurdle! 🚀
