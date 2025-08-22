# Orpheus Backend API Test Script
# PowerShell script to test the Orpheus API endpoints

Write-Host "🎵 Testing Orpheus Backend API" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

# Function to make HTTP requests
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "`n🔍 Testing: $Description" -ForegroundColor Yellow
    Write-Host "   $Method $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "   ✅ Success!" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. Test Health Check
$health = Test-Endpoint -Method "GET" -Url "$baseUrl/health" -Description "Health Check"

if ($health) {
    Write-Host "   Status: $($health.status)" -ForegroundColor Green
}

# 2. Get Test Token
$tokenResponse = Test-Endpoint -Method "GET" -Url "$baseUrl/auth/token" -Description "Get Test Token"

if ($tokenResponse) {
    $token = $tokenResponse.token
    Write-Host "   Token obtained: $($token.Substring(0, 20))..." -ForegroundColor Green
    
    $authHeaders = @{
        "Authorization" = "Bearer $token"
    }
    
    # 3. Test Create Project
    $projectData = @{
        project_name = "Hackathon Demo Track"
        contributors = @(
            @{
                name = "Alice Producer"
                wallet_address = "alice-icp-principal"
                email = "alice@orpheus.com"
            },
            @{
                name = "Bob Vocalist"
                wallet_address = "bob-icp-principal"
                email = "bob@orpheus.com"
            }
        )
        splits = @(
            @{
                contributor_name = "Alice Producer"
                percentage = 60.0
            },
            @{
                contributor_name = "Bob Vocalist"
                percentage = 40.0
            }
        )
    } | ConvertTo-Json -Depth 3
    
    $project = Test-Endpoint -Method "POST" -Url "$baseUrl/api/projects" -Description "Create Project" -Headers $authHeaders -Body $projectData
    
    if ($project) {
        $projectId = $project.id
        Write-Host "   Project ID: $projectId" -ForegroundColor Green
        
        # 4. Test Get All Projects
        $projects = Test-Endpoint -Method "GET" -Url "$baseUrl/api/projects" -Description "Get All Projects" -Headers $authHeaders
        
        if ($projects) {
            Write-Host "   Found $($projects.total) project(s)" -ForegroundColor Green
        }
        
        # 5. Test Get Project by ID
        $projectDetail = Test-Endpoint -Method "GET" -Url "$baseUrl/api/projects/$projectId" -Description "Get Project by ID" -Headers $authHeaders
        
        if ($projectDetail) {
            Write-Host "   Project: $($projectDetail.project_name)" -ForegroundColor Green
            Write-Host "   Contributors: $($projectDetail.contributors.Count)" -ForegroundColor Green
        }
    }
}

Write-Host "`n🎵 Orpheus API Test Complete!" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Start the server with: cargo run" -ForegroundColor Gray
Write-Host "2. Test file upload with your frontend or tools like Postman" -ForegroundColor Gray
Write-Host "3. Connect your frontend to these API endpoints" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy hacking! 🚀" -ForegroundColor Yellow
