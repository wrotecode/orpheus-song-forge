use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;
use anyhow::{Result, Context};
use serde::{Deserialize, Serialize};
use std::path::Path;
use tokio::fs;

use crate::models::Project;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StorageData {
    pub projects: HashMap<Uuid, Project>,
}

impl Default for StorageData {
    fn default() -> Self {
        Self {
            projects: HashMap::new(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct AppStorage {
    data: Arc<RwLock<StorageData>>,
    file_path: String,
}

impl AppStorage {
    pub fn new(file_path: String) -> Self {
        Self {
            data: Arc::new(RwLock::new(StorageData::default())),
            file_path,
        }
    }

    pub async fn load_from_file(&self) -> Result<()> {
        if !Path::new(&self.file_path).exists() {
            // Create empty storage file if it doesn't exist
            self.save_to_file().await?;
            return Ok(());
        }

        let content = fs::read_to_string(&self.file_path)
            .await
            .context("Failed to read storage file")?;

        let storage_data: StorageData = serde_json::from_str(&content)
            .context("Failed to parse storage file")?;

        let mut data = self.data.write().await;
        *data = storage_data;

        tracing::info!("Loaded {} projects from storage", data.projects.len());
        Ok(())
    }

    pub async fn save_to_file(&self) -> Result<()> {
        let data = self.data.read().await;
        let json = serde_json::to_string_pretty(&*data)
            .context("Failed to serialize storage data")?;

        // Ensure directory exists
        if let Some(parent) = Path::new(&self.file_path).parent() {
            fs::create_dir_all(parent).await
                .context("Failed to create storage directory")?;
        }

        fs::write(&self.file_path, json)
            .await
            .context("Failed to write storage file")?;

        tracing::debug!("Saved storage to {}", self.file_path);
        Ok(())
    }

    pub async fn create_project(&self, project: Project) -> Result<Uuid> {
        let project_id = project.id;
        
        {
            let mut data = self.data.write().await;
            data.projects.insert(project_id, project);
        }

        // Persist to file
        self.save_to_file().await?;
        
        Ok(project_id)
    }

    pub async fn get_project(&self, id: Uuid) -> Option<Project> {
        let data = self.data.read().await;
        data.projects.get(&id).cloned()
    }

    pub async fn get_all_projects(&self) -> Vec<Project> {
        let data = self.data.read().await;
        data.projects.values().cloned().collect()
    }

    pub async fn update_project(&self, id: Uuid, project: Project) -> Result<()> {
        {
            let mut data = self.data.write().await;
            if data.projects.contains_key(&id) {
                data.projects.insert(id, project);
            } else {
                return Err(anyhow::anyhow!("Project not found"));
            }
        }

        // Persist to file
        self.save_to_file().await?;
        Ok(())
    }

    pub async fn delete_project(&self, id: Uuid) -> Result<()> {
        {
            let mut data = self.data.write().await;
            if data.projects.remove(&id).is_none() {
                return Err(anyhow::anyhow!("Project not found"));
            }
        }

        // Persist to file
        self.save_to_file().await?;
        Ok(())
    }

    pub async fn add_audio_file_to_project(&self, project_id: Uuid, file_path: String) -> Result<()> {
        {
            let mut data = self.data.write().await;
            if let Some(project) = data.projects.get_mut(&project_id) {
                project.add_audio_file(file_path);
            } else {
                return Err(anyhow::anyhow!("Project not found"));
            }
        }

        // Persist to file
        self.save_to_file().await?;
        Ok(())
    }
}
