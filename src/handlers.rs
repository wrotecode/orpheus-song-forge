use axum::{
    extract::{Path, State, Multipart},
    http::StatusCode,
    Json,
};
use uuid::Uuid;
use std::path::Path as StdPath;
use tokio::fs;
use tokio::io::AsyncWriteExt;

use crate::models::{
    CreateProjectRequest, CreateProjectResponse, Project, ProjectListResponse,
    ErrorResponse, UploadResponse,
};
use crate::storage::AppStorage;

pub async fn create_project(
    State(storage): State<AppStorage>,
    Json(request): Json<CreateProjectRequest>,
) -> Result<Json<CreateProjectResponse>, (StatusCode, Json<ErrorResponse>)> {
    // Validate project name
    if request.project_name.trim().is_empty() {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "validation_error".to_string(),
                message: "Project name cannot be empty".to_string(),
            }),
        ));
    }

    // Validate contributors
    if request.contributors.is_empty() {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "validation_error".to_string(),
                message: "At least one contributor is required".to_string(),
            }),
        ));
    }

    // Validate splits
    if request.splits.len() != request.contributors.len() {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "validation_error".to_string(),
                message: "Number of splits must match number of contributors".to_string(),
            }),
        ));
    }

    // Create project and validate splits
    let project = Project::new(request);
    if let Err(e) = project.validate_splits() {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "validation_error".to_string(),
                message: e,
            }),
        ));
    }

    // Store project
    match storage.create_project(project.clone()).await {
        Ok(project_id) => {
            tracing::info!("Created project: {} ({})", project.project_name, project_id);
            Ok(Json(CreateProjectResponse {
                id: project_id,
                message: "Project created successfully".to_string(),
            }))
        }
        Err(e) => {
            tracing::error!("Failed to create project: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    error: "storage_error".to_string(),
                    message: "Failed to create project".to_string(),
                }),
            ))
        }
    }
}

pub async fn get_all_projects(
    State(storage): State<AppStorage>,
) -> Result<Json<ProjectListResponse>, (StatusCode, Json<ErrorResponse>)> {
    let projects = storage.get_all_projects().await;
    let project_summaries: Vec<_> = projects.iter().map(|p| p.to_summary()).collect();
    
    Ok(Json(ProjectListResponse {
        total: project_summaries.len(),
        projects: project_summaries,
    }))
}

pub async fn get_project_by_id(
    State(storage): State<AppStorage>,
    Path(id): Path<Uuid>,
) -> Result<Json<Project>, (StatusCode, Json<ErrorResponse>)> {
    match storage.get_project(id).await {
        Some(project) => {
            tracing::info!("Retrieved project: {} ({})", project.project_name, id);
            Ok(Json(project))
        }
        None => {
            Err((
                StatusCode::NOT_FOUND,
                Json(ErrorResponse {
                    error: "not_found".to_string(),
                    message: format!("Project with id {} not found", id),
                }),
            ))
        }
    }
}

pub async fn upload_file(
    mut multipart: Multipart,
) -> Result<Json<UploadResponse>, (StatusCode, Json<ErrorResponse>)> {
    // Ensure uploads directory exists
    let uploads_dir = "uploads";
    if let Err(e) = fs::create_dir_all(uploads_dir).await {
        tracing::error!("Failed to create uploads directory: {}", e);
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorResponse {
                error: "storage_error".to_string(),
                message: "Failed to create uploads directory".to_string(),
            }),
        ));
    }

    while let Some(field) = multipart.next_field().await.map_err(|e| {
        tracing::error!("Multipart error: {}", e);
        (
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "upload_error".to_string(),
                message: "Invalid multipart data".to_string(),
            }),
        )
    })? {
        let name = field.name().unwrap_or("unknown");
        
        if name == "file" {
            let file_name = field.file_name()
                .ok_or_else(|| {
                    (
                        StatusCode::BAD_REQUEST,
                        Json(ErrorResponse {
                            error: "upload_error".to_string(),
                            message: "Missing filename".to_string(),
                        }),
                    )
                })?
                .to_string();

            // Validate file extension
            if !file_name.to_lowercase().ends_with(".mp3") {
                return Err((
                    StatusCode::BAD_REQUEST,
                    Json(ErrorResponse {
                        error: "validation_error".to_string(),
                        message: "Only MP3 files are allowed".to_string(),
                    }),
                ));
            }

            // Generate unique filename to avoid conflicts
            let unique_filename = format!("{}_{}", Uuid::new_v4(), file_name);
            let file_path = format!("{}/{}", uploads_dir, unique_filename);

            // Read file data
            let data = field.bytes().await.map_err(|e| {
                tracing::error!("Failed to read file data: {}", e);
                (
                    StatusCode::BAD_REQUEST,
                    Json(ErrorResponse {
                        error: "upload_error".to_string(),
                        message: "Failed to read file data".to_string(),
                    }),
                )
            })?;

            // Save file to disk
            let mut file = fs::File::create(&file_path).await.map_err(|e| {
                tracing::error!("Failed to create file: {}", e);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ErrorResponse {
                        error: "storage_error".to_string(),
                        message: "Failed to save file".to_string(),
                    }),
                )
            })?;

            file.write_all(&data).await.map_err(|e| {
                tracing::error!("Failed to write file: {}", e);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ErrorResponse {
                        error: "storage_error".to_string(),
                        message: "Failed to write file".to_string(),
                    }),
                )
            })?;

            tracing::info!("Uploaded file: {}", file_path);
            
            return Ok(Json(UploadResponse {
                file_path: file_path.clone(),
                message: "File uploaded successfully".to_string(),
            }));
        }
    }

    Err((
        StatusCode::BAD_REQUEST,
        Json(ErrorResponse {
            error: "upload_error".to_string(),
            message: "No file found in request".to_string(),
        }),
    ))
}

// Health check endpoint
pub async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "service": "Orpheus Backend",
        "version": "0.1.0",
        "timestamp": chrono::Utc::now()
    }))
}

// Development endpoint to get a test token
pub async fn get_test_token() -> Json<serde_json::Value> {
    let token = crate::auth::create_test_token();
    Json(serde_json::json!({
        "token": token,
        "type": "Bearer",
        "expires_in": 3600,
        "principal": "rdmx6-jaaaa-aaaah-qcaiq-cai"
    }))
}
