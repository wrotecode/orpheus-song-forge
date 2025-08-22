use axum::{
    middleware,
    routing::{get, post},
    Router,
};
use tower::ServiceBuilder;
use tower_http::{
    cors::CorsLayer,
    trace::TraceLayer,
    services::ServeDir,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::env;

// Import our modules
mod models;
mod storage;
mod handlers;
mod auth;

use storage::AppStorage;
use handlers::*;
use auth::auth_middleware;

#[tokio::main]
async fn main() {
    // Load environment variables from .env file if it exists
    dotenv::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "orpheus_backend=debug,tower_http=debug,axum=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Initialize storage
    let storage_file = env::var("STORAGE_FILE")
        .unwrap_or_else(|_| "data/projects.json".to_string());
    
    let storage = AppStorage::new(storage_file);
    
    // Load existing data from file
    if let Err(e) = storage.load_from_file().await {
        tracing::error!("Failed to load storage: {}", e);
        std::process::exit(1);
    }

    // Create uploads directory if it doesn't exist
    if let Err(e) = tokio::fs::create_dir_all("uploads").await {
        tracing::warn!("Failed to create uploads directory: {}", e);
    }

    // Public routes (no authentication required)
    let public_routes = Router::new()
        .route("/", get(health_check))
        .route("/health", get(health_check))
        .route("/auth/token", get(get_test_token)); // For development/testing

    // Protected routes (require ICP authentication)
    let protected_routes = Router::new()
        .route("/projects", post(create_project).get(get_all_projects))
        .route("/projects/:id", get(get_project_by_id))
        .route("/upload", post(upload_file))
        .layer(middleware::from_fn(auth_middleware))
        .with_state(storage.clone());

    // Combine routes
    let app = Router::new()
        .merge(public_routes)
        .nest("/api", protected_routes)
        // Serve uploaded files statically
        .nest_service("/uploads", ServeDir::new("uploads"))
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(CorsLayer::permissive()),
        );

    // Get port from environment or default to 3000
    let port = env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse::<u16>()
        .unwrap_or(3000);
    
    let bind_addr = format!("0.0.0.0:{}", port);

    // Run the server
    let listener = tokio::net::TcpListener::bind(&bind_addr)
        .await
        .expect("Failed to bind to address");
    
    tracing::info!("🎵 Orpheus Backend Server starting...");
    tracing::info!("📡 Server running on http://{}", bind_addr);
    tracing::info!("📂 Storage file: {}", storage_file);
    tracing::info!("🎧 Ready to accept music collaboration requests!");
    
    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}
