use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::caller;
use std::collections::HashMap;
use std::sync::Mutex;
use std::sync::atomic::{AtomicU64, Ordering};

// Data model
#[derive(CandidType, Deserialize, Clone)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub owner_principal: Principal,
}

// Request/Response types
#[derive(CandidType, Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
}

#[derive(CandidType, Deserialize)]
pub struct CreateProjectResponse {
    pub success: bool,
    pub project_id: Option<String>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize)]
pub struct ListProjectsResponse {
    pub success: bool,
    pub projects: Vec<Project>,
    pub error: Option<String>,
}

// In-memory storage with proper initialization
lazy_static::lazy_static! {
    static ref PROJECTS: Mutex<HashMap<String, Project>> = Mutex::new(HashMap::new());
    static ref NEXT_ID: AtomicU64 = AtomicU64::new(1);
}

// Canister methods
#[ic_cdk::query]
pub fn whoami() -> Principal {
    caller()
}

#[ic_cdk::update]
pub fn create_project(request: CreateProjectRequest) -> CreateProjectResponse {
    let caller = caller();
    
    let project_id = format!("project_{}", NEXT_ID.fetch_add(1, Ordering::SeqCst));
    
    let project = Project {
        id: project_id.clone(),
        name: request.name,
        owner_principal: caller,
    };
    
    if let Ok(mut projects) = PROJECTS.lock() {
        projects.insert(project_id.clone(), project);
        
        CreateProjectResponse {
            success: true,
            project_id: Some(project_id),
            error: None,
        }
    } else {
        CreateProjectResponse {
            success: false,
            project_id: None,
            error: Some("Failed to acquire lock".to_string()),
        }
    }
}

#[ic_cdk::query]
pub fn list_projects() -> ListProjectsResponse {
    let caller = caller();
    
    if let Ok(projects) = PROJECTS.lock() {
        let user_projects: Vec<Project> = projects
            .values()
            .filter(|project| project.owner_principal == caller)
            .cloned()
            .collect();
        
        ListProjectsResponse {
            success: true,
            projects: user_projects,
            error: None,
        }
    } else {
        ListProjectsResponse {
            success: false,
            projects: vec![],
            error: Some("Failed to acquire lock".to_string()),
        }
    }
}
