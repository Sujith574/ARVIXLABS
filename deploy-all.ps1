#!/usr/bin/env pwsh
# ==============================================================================
# Arvix Labs - UNIFIED PRODUCTION DEPLOYMENT SCRIPT
# Project: arvixlabs-241094  |  Region: asia-south1
# This script deploys both Backend and Frontend to Google Cloud Run.
# ==============================================================================

$PROJECT_ID = "arvixlabs-241094"
$REGION     = "asia-south1"
$DB_INSTANCE = "arvix-db-prod"
$BACKEND_SERVICE = "arvix-backend"
$FRONTEND_SERVICE = "arvix-frontend"
$BACKEND_IMAGE = "gcr.io/arvixlabs-241094/arvix-backend:latest"
$FRONTEND_IMAGE = "gcr.io/arvixlabs-241094/arvix-frontend:latest"

Write-Host "`n[INFO] Arvix Labs - Unified Platform Deployment" -ForegroundColor Cyan
Write-Host "   Project : $PROJECT_ID" -ForegroundColor Gray
Write-Host "   Region  : $REGION`n" -ForegroundColor Gray

# --- 1. Set Project -----------------------------------------------------------
gcloud config set project $PROJECT_ID

# --- 2. Check Database Status -------------------------------------------------
Write-Host "[WAIT] Checking Cloud SQL instance..." -ForegroundColor Yellow
$state = gcloud sql instances describe $DB_INSTANCE --project=$PROJECT_ID --format="value(state)"
if ($state -ne "RUNNABLE") {
    Write-Host "[BUSY] Database is in state: $state. Waiting for completion..." -ForegroundColor Gray
    while ($state -ne "RUNNABLE") {
        Start-Sleep -Seconds 15
        $state = gcloud sql instances describe $DB_INSTANCE --project=$PROJECT_ID --format="value(state)"
        Write-Host "   Status: $state" -ForegroundColor Gray
    }
}
$CONN_NAME = gcloud sql instances describe $DB_INSTANCE --project=$PROJECT_ID --format="value(connectionName)"
Write-Host "[OK] Database is ONLINE ($CONN_NAME)" -ForegroundColor Green

# --- 3. Initialize DB & User --------------------------------------------------
Write-Host "`n[DB] Initializing Database & User..." -ForegroundColor Yellow
gcloud sql databases create arvix_db --instance=$DB_INSTANCE --project=$PROJECT_ID 2>$null
$DB_PASS = gcloud secrets versions access latest --secret=DB_PASSWORD --project=$PROJECT_ID
gcloud sql users create arvix_user --instance=$DB_INSTANCE --password=$DB_PASS --project=$PROJECT_ID 2>$null
Write-Host "   [OK] Database 'arvix_db' and user 'arvix_user' verified." -ForegroundColor Green

# --- 4. Build & Deploy BACKEND ------------------------------------------------
Write-Host "`n[DOCKER] Deploying BACKEND..." -ForegroundColor Yellow

# Build specifically for linux/amd64 (Cloud Run)
gcloud builds submit --tag $BACKEND_IMAGE backend/

# Deploy to Cloud Run
gcloud run deploy $BACKEND_SERVICE `
    --image=$BACKEND_IMAGE `
    --region=$REGION `
    --platform=managed `
    --allow-unauthenticated `
    --memory=1Gi `
    --cpu=1 `
    --add-cloudsql-instances=$CONN_NAME `
    --set-env-vars="DATABASE_URL=postgresql://arvix_user:$DB_PASS@/arvix_db?host=/cloudsql/$CONN_NAME" `
    --set-env-vars="ALLOWED_ORIGINS=*" `
    --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,SECRET_KEY=SECRET_KEY:latest,MAIL_PASSWORD=MAIL_PASSWORD:latest" `
    --project=$PROJECT_ID

$BACKEND_URL = gcloud run services describe $BACKEND_SERVICE --region=$REGION --project=$PROJECT_ID --format="value(status.url)"
Write-Host "[OK] Backend LIVE at: $BACKEND_URL" -ForegroundColor Green

# --- 5. Build & Deploy FRONTEND -----------------------------------------------
Write-Host "`n[UI] Deploying FRONTEND..." -ForegroundColor Yellow

# Note: We pass the live backend URL as a build argument via cloudbuild.yaml
gcloud builds submit --config frontend/cloudbuild.yaml `
    --substitutions=_NEXT_PUBLIC_API_URL=$BACKEND_URL `
    frontend/

gcloud run deploy $FRONTEND_SERVICE `
    --image=$FRONTEND_IMAGE `
    --region=$REGION `
    --platform=managed `
    --allow-unauthenticated `
    --memory=512Mi `
    --cpu=1 `
    --project=$PROJECT_ID

$FRONTEND_URL = gcloud run services describe $FRONTEND_SERVICE --region=$REGION --project=$PROJECT_ID --format="value(status.url)"

# --- 6. Final Summary ---------------------------------------------------------
Write-Host "`n[DONE] PLATFORM DEPLOYMENT COMPLETE!" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------"
Write-Host "URL Frontend (Public) : $FRONTEND_URL" -ForegroundColor Green
Write-Host "URL Backend API       : $BACKEND_URL" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------"
