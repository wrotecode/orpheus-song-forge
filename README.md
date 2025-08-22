# 🎵 Orpheus Backend - Decentralized Music Collaboration Studio

A Rust-based backend for Orpheus, a decentralized music collaboration platform powered by ICP (Internet Computer Protocol) blockchain authentication.

## 🚀 Features

- **Project Management**: Create and manage music collaboration projects
- **Contributor Management**: Track contributors and their revenue splits
- **File Upload**: Upload MP3 files for collaboration
- **ICP Authentication**: Blockchain-powered authentication using ICP principals
- **Persistent Storage**: In-memory storage with JSON file persistence
- **RESTful API**: Clean REST endpoints for frontend integration

## 📋 API Endpoints

### Public Endpoints

#### Health Check
```
GET /health
```
Returns server health status.

#### Get Test Token (Development)
```
GET /auth/token
```
Returns a test ICP authentication token for development purposes.

### Protected Endpoints (Require ICP Authentication)

All protected endpoints require an `Authorization: Bearer <token>` header with a valid ICP token.

#### Create Project
```
POST /api/projects
Content-Type: application/json

{
  "project_name": "My Awesome Track",
  "contributors": [
    {
      "name": "Alice Producer",
      "wallet_address": "rdmx6-jaaaa-aaaah-qcaiq-cai",
      "email": "alice@example.com"
    },
    {
      "name": "Bob Vocalist", 
      "wallet_address": "rrkah-fqaaa-aaaah-qcaiq-cai",
      "email": "bob@example.com"
    }
  ],
  "splits": [
    {
      "contributor_name": "Alice Producer",
      "percentage": 60.0
    },
    {
      "contributor_name": "Bob Vocalist",
      "percentage": 40.0
    }
  ]
}
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Project created successfully"
}
```

#### Get All Projects
```
GET /api/projects
```

Response:
```json
{
  "projects": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "project_name": "My Awesome Track",
      "contributors_count": 2,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

#### Get Project by ID
```
GET /api/projects/{id}
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "project_name": "My Awesome Track",
  "contributors": [
    {
      "name": "Alice Producer",
      "wallet_address": "rdmx6-jaaaa-aaaah-qcaiq-cai",
      "email": "alice@example.com"
    }
  ],
  "splits": [
    {
      "contributor_name": "Alice Producer",
      "percentage": 60.0
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "audio_files": []
}
```

#### Upload MP3 File
```
POST /api/upload
Content-Type: multipart/form-data

Form data:
- file: <MP3 file>
```

Response:
```json
{
  "file_path": "uploads/550e8400-e29b-41d4-a716-446655440000_track.mp3",
  "message": "File uploaded successfully"
}
```

### Static File Serving

Uploaded files are served at:
```
GET /uploads/{filename}
```

## 🔐 Authentication

The backend uses ICP (Internet Computer Protocol) blockchain authentication. For the hackathon MVP, we use a simplified token format:

1. **Token Format**: Base64-encoded JSON containing:
   ```json
   {
     "principal": "rdmx6-jaaaa-aaaah-qcaiq-cai",
     "exp": 1642234800,
     "iat": 1642231200
   }
   ```

2. **Usage**: Include in request headers:
   ```
   Authorization: Bearer <base64-encoded-token>
   ```

3. **Development**: Use `GET /auth/token` to get a test token.

## 🛠️ Setup & Installation

### Prerequisites

- Rust (latest stable version)
- Cargo package manager

### Installation Steps

1. **Clone/Navigate to the project**:
   ```bash
   cd rust-backend
   ```

2. **Install dependencies**:
   ```bash
   cargo build
   ```

3. **Create environment file** (optional):
   ```bash
   # Create .env file
   echo "PORT=3000" > .env
   echo "STORAGE_FILE=data/projects.json" >> .env
   ```

4. **Run the server**:
   ```bash
   cargo run
   ```

The server will start on `http://0.0.0.0:3000` by default.

## 📁 Project Structure

```
src/
├── main.rs          # Server setup and routing
├── models.rs        # Data structures and models
├── storage.rs       # In-memory storage with JSON persistence
├── handlers.rs      # API request handlers
└── auth.rs          # ICP authentication middleware

data/
└── projects.json    # Persistent storage file

uploads/
└── (uploaded MP3 files)
```

## 🧪 Testing the API

### 1. Get a test token:
```bash
curl http://localhost:3000/auth/token
```

### 2. Create a project:
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "project_name": "Epic Collaboration",
    "contributors": [
      {
        "name": "Alice",
        "wallet_address": "alice-principal-id",
        "email": "alice@music.com"
      },
      {
        "name": "Bob", 
        "wallet_address": "bob-principal-id",
        "email": "bob@music.com"
      }
    ],
    "splits": [
      {
        "contributor_name": "Alice",
        "percentage": 70.0
      },
      {
        "contributor_name": "Bob",
        "percentage": 30.0
      }
    ]
  }'
```

### 3. Get all projects:
```bash
curl http://localhost:3000/api/projects \
  -H "Authorization: Bearer <your-token>"
```

### 4. Upload an MP3 file:
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@path/to/your/track.mp3"
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `STORAGE_FILE`: Path to JSON storage file (default: data/projects.json)

### Storage

The backend uses a hybrid storage approach:
- **In-memory**: Fast read/write operations during runtime
- **JSON persistence**: Automatic saves to file for data persistence between restarts

## 🚨 Error Handling

All errors return JSON in this format:
```json
{
  "error": "error_code",
  "message": "Human-readable error message"
}
```

Common error codes:
- `validation_error`: Invalid request data
- `unauthorized`: Authentication failure
- `not_found`: Resource not found
- `storage_error`: Storage operation failure
- `upload_error`: File upload failure

## 🎯 Hackathon MVP Notes

This is a hackathon MVP implementation with the following simplifications:

1. **Authentication**: Simplified ICP token verification (production would use proper cryptographic verification)
2. **Storage**: JSON file persistence (production would use a proper database)
3. **File Storage**: Local filesystem (production would use cloud storage)
4. **Validation**: Basic validation (production would have more comprehensive checks)

## 🔄 Development

### Running in Development Mode

```bash
# With debug logging
RUST_LOG=debug cargo run

# With auto-reload (install cargo-watch first)
cargo install cargo-watch
cargo watch -x run
```

### Building for Production

```bash
cargo build --release
```

## 📝 License

MIT License - Perfect for hackathon projects!

---

**Built with ❤️ for music collaboration on the blockchain** 🎶⛓️
