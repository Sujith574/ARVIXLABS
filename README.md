# Arvix Labs — AI-Powered Government Data Intelligence Platform

A production-grade, fully CMS-driven SaaS platform for government data intelligence.
**No hardcoded content** — everything is managed through the admin dashboard.

---

## Quick Start (Local)

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in your keys
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000/api/docs
```

### 3. Full Stack (Docker)
```bash
docker-compose up --build
```

---

## Admin Dashboard

**URL:** http://localhost:3000/admin/login

**Default credentials (set in `backend/.env`):**
```
Username: admin
Password: arvixlabs2024!
```

### Admin Sections

| Section | URL | What you can do |
|---------|-----|-----------------|
| Dashboard | `/admin/dashboard` | Overview stats + quick actions |
| Content Manager | `/admin/cms` | Edit hero text, features, solutions, stats bar |
| AI Knowledge | `/admin/ai` | Upload datasets, add context text to RAG pipeline |
| Datasets | `/admin/datasets` | View all ingested data |
| Team | `/admin/team` | Add/edit/delete founders & developers |
| Media | `/admin/media` | Upload images (Firebase Storage) |
| Settings | `/admin/settings` | API keys, site config |

---

## Public Website

| Page | URL |
|------|-----|
| Home (CMS-driven) | `/` |
| About / Team | `/about` |

---

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/arvix_db
SECRET_KEY=change-me-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=arvixlabs2024!
GEMINI_API_KEY=your-gemini-api-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="..."
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Project Structure

```
ARVIXLABS/
├── frontend/
│   └── src/app/
│       ├── page.tsx              # 🌐 Public homepage (CMS-driven)
│       ├── about/                # 🌐 About + Team
│       └── admin/
│           ├── login/            # 🔒 Admin login
│           ├── dashboard/        # 📊 Overview
│           ├── cms/              # ✏️  Content manager (hero, features, solutions, stats)
│           ├── ai/               # 🤖 Dataset upload + context ingestion
│           ├── datasets/         # 📁 Ingested dataset list
│           ├── team/             # 👥 Founders & developers
│           ├── media/            # 🖼️  Image uploads
│           └── settings/         # ⚙️  Site configuration
│
├── backend/
│   └── app/
│       ├── main.py              # FastAPI app + router registration
│       ├── core/security.py     # Single-admin JWT auth
│       └── api/v1/
│           ├── auth.py          # Admin login endpoint
│           ├── cms.py           # CMS CRUD (hero, features, solutions, stats)
│           ├── ai.py            # Gemini chat + dataset ingestion
│           ├── founders.py      # Team profiles (Firestore + fallback)
│           └── media.py         # Firebase Storage upload
│
├── docker-compose.yml
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS v4, Framer Motion |
| Backend | FastAPI (Python), Pydantic v2 |
| Database | PostgreSQL (structured), Firebase Firestore (CMS data) |
| AI | Gemini 1.5 Flash + FAISS (RAG pipeline) |
| Storage | Firebase Storage |
| Deployment | Google Cloud Run (backend), Vercel (frontend) |

---

## Deployment

### Backend → Google Cloud Run
```bash
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT/arvix-backend
gcloud run deploy arvix-backend --image gcr.io/YOUR_PROJECT/arvix-backend \
  --region us-central1 --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=..." 
```

### Frontend → Vercel
```bash
cd frontend
vercel --prod
# Set NEXT_PUBLIC_API_URL to your Cloud Run backend URL
```
