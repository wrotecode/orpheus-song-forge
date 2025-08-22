use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Contributor {
    pub name: String,
    pub wallet_address: Option<String>, // ICP wallet address
    pub email: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Split {
    pub contributor_name: String,
    pub percentage: f64, // Should add up to 100.0 for all contributors
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: Uuid,
    pub project_name: String,
    pub contributors: Vec<Contributor>,
    pub splits: Vec<Split>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub audio_files: Vec<String>, // Paths to uploaded audio files
}

#[derive(Debug, Deserialize)]
pub struct CreateProjectRequest {
    pub project_name: String,
    pub contributors: Vec<Contributor>,
    pub splits: Vec<Split>,
}

#[derive(Debug, Serialize)]
pub struct CreateProjectResponse {
    pub id: Uuid,
    pub message: String,
}

#[derive(Debug, Serialize)]
pub struct ProjectListResponse {
    pub projects: Vec<ProjectSummary>,
    pub total: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectSummary {
    pub id: Uuid,
    pub project_name: String,
    pub contributors_count: usize,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct UploadResponse {
    pub file_path: String,
    pub message: String,
}

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String,
    pub message: String,
}

#[derive(Debug, Deserialize)]
pub struct ICPAuthClaim {
    pub principal: String,
    pub exp: i64,
    pub iat: i64,
}

impl Project {
    pub fn new(request: CreateProjectRequest) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            project_name: request.project_name,
            contributors: request.contributors,
            splits: request.splits,
            created_at: now,
            updated_at: now,
            audio_files: Vec::new(),
        }
    }

    pub fn to_summary(&self) -> ProjectSummary {
        ProjectSummary {
            id: self.id,
            project_name: self.project_name.clone(),
            contributors_count: self.contributors.len(),
            created_at: self.created_at,
        }
    }

    pub fn validate_splits(&self) -> Result<(), String> {
        let total: f64 = self.splits.iter().map(|s| s.percentage).sum();
        if (total - 100.0).abs() > 0.01 {
            return Err(format!("Split percentages must sum to 100%, got {:.2}%", total));
        }
        
        for split in &self.splits {
            if split.percentage < 0.0 || split.percentage > 100.0 {
                return Err(format!("Split percentage must be between 0-100%, got {:.2}%", split.percentage));
            }
        }
        
        Ok(())
    }

    pub fn add_audio_file(&mut self, file_path: String) {
        self.audio_files.push(file_path);
        self.updated_at = Utc::now();
    }
}
