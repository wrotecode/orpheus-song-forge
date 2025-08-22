# Build stage
FROM rust:1.80 as builder

WORKDIR /app

# Copy Cargo files first for better layer caching
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs to build dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies first
RUN cargo build --release && rm -rf src

# Copy source code
COPY src ./src

# Build the application
RUN touch src/main.rs && cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create necessary directories
RUN mkdir -p data uploads

# Copy the binary from builder stage
COPY --from=builder /app/target/release/orpheus-backend .

# Copy .env file if it exists
COPY .env* ./

# Set environment variables
ENV PORT=3000
ENV STORAGE_FILE=data/projects.json

# Expose port
EXPOSE 3000

# Create volume for persistent data
VOLUME ["/app/data", "/app/uploads"]

# Run the application
CMD ["./orpheus-backend"]
