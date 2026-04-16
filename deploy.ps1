#!/usr/bin/env pwsh
# ============================================================
# Arvix Labs — Google Cloud Run Deployment Script
# Project: arvixlabs-241094  |  Region: asia-south1
# ============================================================

$PROJECT_ID = "arvixlabs-241094"
$REGION     = "asia-south1"
$SERVICE    = "arvix-backend"
$IMAGE      = "gcr.io/$PROJECT_ID/$SERVICE"

Write-Host "`n🚀 Arvix Labs — Cloud Run Deployment" -ForegroundColor Cyan
Write-Host "   Project : $PROJECT_ID" -ForegroundColor Gray
Write-Host "   Region  : $REGION" -ForegroundColor Gray
Write-Host "   Service : $SERVICE`n" -ForegroundColor Gray

# ── 1. Set active project ──────────────────────────────────────────────────────
Write-Host "📌 Setting project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# ── 2. Enable required APIs ────────────────────────────────────────────────────
Write-Host "🔧 Enabling APIs (first run only)..." -ForegroundColor Yellow
gcloud services enable `
    run.googleapis.com `
    cloudbuild.googleapis.com `
    containerregistry.googleapis.com `
    secretmanager.googleapis.com `
    firebase.googleapis.com `
    --project=$PROJECT_ID

# ── 3. Store secrets in Secret Manager ────────────────────────────────────────
Write-Host "`n🔑 Setting up Secret Manager secrets..." -ForegroundColor Yellow

function Set-Secret([string]$name, [string]$prompt) {
    $existing = gcloud secrets describe $name --project=$PROJECT_ID 2>&1
    if ($LASTEXITCODE -ne 0) {
        $value = Read-Host "Enter $prompt"
        $value | gcloud secrets create $name --data-file=- --project=$PROJECT_ID
        Write-Host "  ✓ Created secret: $name" -ForegroundColor Green
    } else {
        $update = Read-Host "Secret '$name' exists. Update it? (y/N)"
        if ($update -eq 'y') {
            $value = Read-Host "Enter new $prompt"
            $value | gcloud secrets versions add $name --data-file=- --project=$PROJECT_ID
            Write-Host "  ✓ Updated secret: $name" -ForegroundColor Green
        } else {
            Write-Host "  ↷ Kept existing: $name" -ForegroundColor Gray
        }
    }
}

Set-Secret "GEMINI_API_KEY"  "Gemini API Key (from Google AI Studio)"
Set-Secret "SECRET_KEY"      "JWT Secret Key (random long string)"
Set-Secret "ADMIN_USERNAME"  "Admin username"
Set-Secret "ADMIN_PASSWORD"  "Admin password"

# ── 4. Build & push Docker image ───────────────────────────────────────────────
Write-Host "`n🐳 Building Docker image..." -ForegroundColor Yellow
$TAG = (git -C . rev-parse --short HEAD 2>$null) ?? "latest"
docker build -t "${IMAGE}:${TAG}" -t "${IMAGE}:latest" -f backend/Dockerfile ./backend

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed" -ForegroundColor Red; exit 1
}

Write-Host "📤 Pushing to Google Container Registry..." -ForegroundColor Yellow
docker push "${IMAGE}:${TAG}"
docker push "${IMAGE}:latest"

# ── 5. Deploy to Cloud Run ─────────────────────────────────────────────────────
Write-Host "`n☁️  Deploying to Cloud Run ($REGION)..." -ForegroundColor Yellow

gcloud run deploy $SERVICE `
    --image="${IMAGE}:${TAG}" `
    --region=$REGION `
    --platform=managed `
    --allow-unauthenticated `
    --memory=1Gi `
    --cpu=1 `
    --min-instances=0 `
    --max-instances=5 `
    --concurrency=80 `
    --timeout=120s `
    --set-env-vars="FIREBASE_PROJECT_ID=$PROJECT_ID" `
    --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,SECRET_KEY=SECRET_KEY:latest,ADMIN_USERNAME=ADMIN_USERNAME:latest,ADMIN_PASSWORD=ADMIN_PASSWORD:latest" `
    --project=$PROJECT_ID

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed" -ForegroundColor Red; exit 1
}

# ── 6. Get the live URL ────────────────────────────────────────────────────────
$URL = gcloud run services describe $SERVICE --region=$REGION --project=$PROJECT_ID --format="value(status.url)"
Write-Host "`n✅ Backend is LIVE!" -ForegroundColor Green
Write-Host "   🌐 URL  : $URL" -ForegroundColor Cyan
Write-Host "   📖 Docs : $URL/api/docs" -ForegroundColor Cyan

Write-Host "`n📋 Next steps:"
Write-Host "  1. Copy the URL above"
Write-Host "  2. Set it in frontend/.env.local → NEXT_PUBLIC_API_URL=$URL"
Write-Host "  3. Deploy frontend: cd frontend && vercel --prod"
