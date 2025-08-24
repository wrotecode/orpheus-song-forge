# 🎵 Orpheus - Music Collaboration on Internet Computer

A minimal, hackathon-ready music collaboration platform built on ICP with Rust backend and React frontend.

## 🚀 Quick Start

### Prerequisites
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) installed
- Node.js 18+ and npm
- Rust toolchain

### Deploy to ICP

1. **Start local ICP network:**
   ```bash
   dfx start --background
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the frontend:**
   ```bash
   npm run build
   ```

4. **Deploy canisters:**
   ```bash
   dfx deploy
   ```

5. **Open the application:**
   ```bash
   dfx canister open orpheus_frontend
   ```

## 🎯 Demo Steps

1. **Landing Page** - Beautiful animated landing page loads first
2. **Login/Signup** - Navigate to authentication pages
3. **Dashboard** - After login, access project management
4. **Create Projects** - Add new music collaboration projects
5. **View Projects** - See all your created projects

## 🏗️ Project Structure

- **`src/LandingPage.tsx`** - Beautiful landing page with GSAP animations
- **`src/LoginPage.tsx`** - User authentication login page
- **`src/SignupPage.tsx`** - User registration page
- **`src/Dashboard.tsx`** - Project management dashboard
- **`src/App.tsx`** - Main app with React Router navigation
- **`src/orpheus_backend/lib.rs`** - Rust canister with Candid interface
- **`dfx.json`** - ICP deployment configuration
- **`dist/`** - Frontend build output (auto-generated)

## 🔧 Development

### Local Development
```bash
# Frontend (React)
npm run dev

# Backend (Rust)
cargo build
```

### Build for Production
```bash
npm run build
```

## 🌐 Canisters

- **`orpheus_backend`** - Rust canister handling project management
- **`orpheus_frontend`** - Asset canister serving the React frontend

## 📚 Backend API

The backend canister provides these methods:
- `whoami()` - Returns the caller's Principal
- `create_project(name: String)` - Creates a new project
- `list_projects()` - Returns all projects for the caller

## 🎨 Frontend Features

- **Landing Page First** - Beautiful animated ORPHEUS text loads first
- **Hero Video Background** - Studio footage background
- **GSAP Animations** - Smooth text animations and transitions
- **Responsive Design** - Works on all device sizes
- **Modern UI** - Clean, professional design with red accent color
- **React Router** - Seamless navigation between pages

## 🚀 Next Steps

1. **Test the landing page** - Open the frontend URL
2. **Navigate through pages** - Test login, signup, and dashboard
3. **Customize animations** - Modify GSAP animations in LandingPage.tsx
4. **Add more features** - Expand project management capabilities
5. **Deploy to mainnet** - When ready for production

## 🎵 Ready for Hackathon!

Your project now has:
- ✅ **Beautiful Landing Page** - Loads first with stunning animations
- ✅ **ICP compatibility** - Deployed and working on Internet Computer
- ✅ **Modern React frontend** - With routing and responsive design
- ✅ **Rust backend canister** - Handling project management
- ✅ **Professional UI/UX** - Based on your original design
- ✅ **GSAP animations** - Smooth, engaging user experience

**Happy hacking! 🚀🎶**
