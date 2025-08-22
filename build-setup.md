# Build Setup for Orpheus Backend

## Windows Build Requirements

Since you're on Windows, you need to install the Microsoft C++ Build Tools to compile Rust projects with native dependencies.

### Option 1: Install Visual Studio Build Tools (Recommended)

1. **Download and install Visual Studio Build Tools**:
   - Go to: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
   - Download "Build Tools for Visual Studio 2022"
   - Run the installer
   - Select "C++ build tools" workload
   - Install

2. **After installation, restart your terminal and try**:
   ```cmd
   cargo build
   ```

### Option 2: Use GNU toolchain (Alternative)

If you prefer to use GNU instead of MSVC:

1. **Install the GNU target**:
   ```cmd
   rustup target add x86_64-pc-windows-gnu
   ```

2. **Install MinGW-w64**:
   - Download from: https://www.mingw-w64.org/downloads/
   - Or use chocolatey: `choco install mingw`
   - Or use scoop: `scoop install mingw`

3. **Build with GNU target**:
   ```cmd
   cargo build --target x86_64-pc-windows-gnu
   ```

### Quick Test

Once you have the build environment set up, test the build:

```cmd
cargo check
```

This will verify dependencies without doing a full compile.

## Alternative: Docker Development

If you prefer not to install build tools locally, you can use Docker:

1. **Create Dockerfile** (already provided in project)
2. **Build with Docker**:
   ```cmd
   docker build -t orpheus-backend .
   docker run -p 3000:3000 orpheus-backend
   ```

## Verification

After setting up the build environment, you should be able to run:

```cmd
cargo build
cargo run
```

The server will start and show the Orpheus welcome message! 🎵
