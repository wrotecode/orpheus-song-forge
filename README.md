# 🎵 Orpheus Song Forge - Decentralized Music Collaboration Platform

A full-stack decentralized music collaboration platform powered by ICP (Internet Computer Protocol) blockchain authentication, featuring a React frontend and Rust backend.

## 🚀 Overview

**Orpheus Song Forge** enables musicians to collaborate seamlessly on projects with:
- **Blockchain Authentication** via ICP principals
- **Smart Revenue Splitting** with automatic validation
- **File Collaboration** with MP3 upload and sharing
- **Project Management** with contributor tracking
- **Real-time Collaboration** interface

## 🏗️ Architecture

```
orpheus-song-forge/
├── 📱 Frontend (React + TypeScript)
│   ├── src/components/          # React components
│   ├── src/pages/              # Application pages  
│   └── src/integrations/       # Supabase & external APIs
│
├── 🦀 Backend (Rust + Axum)
│   ├── src/handlers.rs         # API request handlers
│   ├── src/models.rs           # Data structures
│   ├── src/auth.rs             # ICP authentication
│   └── src/storage.rs          # Persistent storage
│
└── 🐳 Infrastructure
    ├── Dockerfile              # Container configuration
    └── docker-compose.yml      # Multi-service setup
```

---

# 📱 Frontend (React)

Built with modern web technologies for an optimal user experience.

## 🛠️ Frontend Tech Stack
- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Supabase** for additional data persistence

## 🚀 Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:5173`

## 📋 Frontend Features
- ✅ **Artist Profiles** - Manage your musical identity
- ✅ **Collaboration Rooms** - Real-time project workspaces  
- ✅ **Project Dashboard** - Track all your collaborations
- ✅ **File Sharing** - Upload and share audio files
- ✅ **Revenue Management** - Configure profit splits

---

# 🦀 Backend (Rust)

High-performance backend API built with Rust and Axum framework.

## 🛠️ Backend Tech Stack
- **Rust** with Axum web framework
- **Tokio** for async runtime
- **Serde** for JSON serialization
- **ICP Integration** for blockchain auth
- **File Upload** with validation

## 🚀 Backend Setup

### Prerequisites
- Rust (latest stable)
- Visual Studio Build Tools (Windows)

### Installation Steps

1. **Navigate to project**:
   ```bash
   cd orpheus-song-forge
   ```

2. **Install Rust dependencies**:
   ```bash
   cargo build
   ```

3. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the server**:
   ```bash
   cargo run
   # OR use the convenience script:
   ./run.bat
   ```

The backend will be available at `http://localhost:3000`

## 📋 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /auth/token` - Get test ICP token (development)

### Protected Endpoints (Require ICP Auth)
- `POST /api/projects` - Create new collaboration project
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/upload` - Upload MP3 files

### Example API Usage

**1. Get Authentication Token**
```bash
curl http://localhost:3000/auth/token
```

**2. Create a Project**
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "project_name": "Epic Collaboration",
    "contributors": [
      {
        "name": "Alice Producer",
        "wallet_address": "alice-icp-principal",
        "email": "alice@music.com"
      }
    ],
    "splits": [
      {
        "contributor_name": "Alice Producer", 
        "percentage": 100.0
      }
    ]
  }'
```

**3. Upload Audio File**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@track.mp3"
```

---

# 🔐 ICP Blockchain Authentication

## Token Format
For this hackathon MVP, we use simplified ICP tokens:

```json
{
  "principal": "rdmx6-jaaaa-aaaah-qcaiq-cai",
  "exp": 1642234800,
  "iat": 1642231200  
}
```

**Usage**: Include as `Authorization: Bearer <base64-token>`

---

# 🐳 Deployment

## Docker Setup
```bash
# Build and run with Docker
docker build -t orpheus-backend .
docker run -p 3000:3000 -v ./data:/app/data orpheus-backend

# Or use Docker Compose for full stack
docker-compose up
```

## Production Deployment
1. **Backend**: Deploy Rust binary with persistent storage
2. **Frontend**: Build static assets and deploy to CDN
3. **Configuration**: Set production environment variables

---

# 🧪 Development & Testing

## Backend Testing
```bash
# Test all API endpoints
./test-api.ps1

# Run with debug logging
RUST_LOG=debug cargo run
```

## Frontend Development
```bash
# Start with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

---

# 🎯 Hackathon Features

## ✅ Implemented
- 🔐 **ICP Authentication** - Blockchain user identity
- 📊 **Project Management** - Create and track collaborations  
- 💰 **Revenue Splits** - Automatic validation (must sum to 100%)
- 📁 **File Upload** - MP3 sharing with unique naming
- 💾 **Persistent Storage** - JSON file storage with in-memory cache
- 🌐 **CORS Support** - Frontend-backend communication
- 🎨 **Modern UI** - shadcn/ui components with Tailwind

## 🔄 Future Enhancements
- Smart contract integration for automatic payments
- Real-time collaboration with WebSockets  
- Advanced audio editing capabilities
- Mobile app with React Native
- Integration with music streaming platforms

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

---

# 📝 License

MIT License - Perfect for open source music collaboration!

---

**Built with ❤️ for the future of decentralized music creation** 🎶⛓️

*Ready for hackathon deployment and beyond!* 🚀
