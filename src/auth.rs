use axum::{
    extract::Request,
    http::{HeaderMap, StatusCode},
    middleware::Next,
    response::Response,
    Json,
};
use base64::{Engine as _, engine::general_purpose};
use serde_json::Value;
use anyhow::{Result, Context};

use crate::models::{ErrorResponse, ICPAuthClaim};

pub struct ICPAuth;

impl ICPAuth {
    // For hackathon MVP, we'll implement a simple ICP principal validation
    // In production, you'd want to verify signatures against ICP's public keys
    pub fn verify_icp_token(token: &str) -> Result<ICPAuthClaim> {
        // Simple token format: base64-encoded JSON with principal
        // Format: {"principal": "rdmx6-jaaaa-aaaah-qcaiq-cai", "exp": timestamp, "iat": timestamp}
        
        let decoded = general_purpose::STANDARD.decode(token)
            .context("Invalid base64 token")?;
        
        let token_str = String::from_utf8(decoded)
            .context("Invalid UTF-8 in token")?;
        
        let claim: ICPAuthClaim = serde_json::from_str(&token_str)
            .context("Invalid token format")?;
        
        // Basic validation - check if token is not expired
        let now = chrono::Utc::now().timestamp();
        if claim.exp < now {
            return Err(anyhow::anyhow!("Token expired"));
        }
        
        // Validate principal format (basic check)
        if !Self::is_valid_principal(&claim.principal) {
            return Err(anyhow::anyhow!("Invalid principal format"));
        }
        
        Ok(claim)
    }
    
    fn is_valid_principal(principal: &str) -> bool {
        // Basic ICP principal validation
        // Principals are typically in format: xxxxx-xxxxx-xxxxx-xxxxx-xxx
        principal.len() > 10 && principal.contains('-')
    }
    
    pub fn create_mock_token(principal: &str) -> String {
        let now = chrono::Utc::now().timestamp();
        let claim = ICPAuthClaim {
            principal: principal.to_string(),
            exp: now + 3600, // 1 hour from now
            iat: now,
        };
        
        let json = serde_json::to_string(&claim).unwrap();
        general_purpose::STANDARD.encode(json.as_bytes())
    }
}

pub async fn auth_middleware(
    headers: HeaderMap,
    request: Request,
    next: Next,
) -> Result<Response, (StatusCode, Json<ErrorResponse>)> {
    // Extract Authorization header
    let auth_header = headers
        .get("authorization")
        .and_then(|h| h.to_str().ok())
        .ok_or_else(|| {
            (
                StatusCode::UNAUTHORIZED,
                Json(ErrorResponse {
                    error: "unauthorized".to_string(),
                    message: "Missing Authorization header".to_string(),
                }),
            )
        })?;

    // Check if it's a Bearer token
    if !auth_header.starts_with("Bearer ") {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(ErrorResponse {
                error: "unauthorized".to_string(),
                message: "Invalid authorization format. Use 'Bearer <token>'".to_string(),
            }),
        ));
    }

    let token = &auth_header[7..]; // Remove "Bearer " prefix

    // Verify the ICP token
    match ICPAuth::verify_icp_token(token) {
        Ok(claim) => {
            tracing::info!("Authenticated user with principal: {}", claim.principal);
            // You could add the claim to request extensions here if needed
            Ok(next.run(request).await)
        }
        Err(e) => {
            tracing::warn!("Authentication failed: {}", e);
            Err((
                StatusCode::UNAUTHORIZED,
                Json(ErrorResponse {
                    error: "unauthorized".to_string(),
                    message: format!("Invalid token: {}", e),
                }),
            ))
        }
    }
}

// Helper function to create a test token for development
pub fn create_test_token() -> String {
    ICPAuth::create_mock_token("rdmx6-jaaaa-aaaah-qcaiq-cai")
}
