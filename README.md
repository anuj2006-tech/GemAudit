# Tender AI - Enterprise Bidding & Document Verification Console

Tender AI is a multi-tenant SaaS application designed for enterprise bidding, tender document verification, and AI-assisted compliance analysis.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+
- npm v9+
- (Optional) Docker & Docker Compose or Redis for multi-process worker task queues.

### 2. Environment Setup

Create `.env` inside `backend/`:
```env
PORT=5000
JWT_SECRET=tender_management_secure_jwt_token_secret_998811
SUPERADMIN_EMAIL=superadmin@tender.ai
SUPERADMIN_PASSWORD=SuperSecurePassword123

# Supabase Cloud Database Credentials
SUPABASE_URL=https://bikpdbrdmlhsixkvotnv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Locally

#### Option A: One-Command Docker Compose (Fastest & Complete)
```bash
docker-compose up --build
```

#### Option B: Standalone Processes

1. **Start Backend API Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend Dev Server**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## ⚙️ Background Document Analysis Pipeline & Task Worker

Document analysis (text extraction → LLM structured extraction → chunking/embedding → vector indexing) runs asynchronously as a **Background Task** to ensure the upload request returns instantly (`processing_status: "queued"`) without blocking the user interface.

### Pipeline Stages & Status Transitions
1. `queued`: File uploaded & task enqueued immediately.
2. `extracting`: Text extraction stage.
3. `analyzing`: LLM structured entity extraction & compliance analysis.
4. `embedding`: Chunking & vector embedding generation (Pinecone / Supabase RAG Store).
5. `indexed`: Indexing complete & searchable in vector database.

### API Endpoints
- **Upload Document (Async Queue)**: `POST /api/documents`
  - *Response*: `{ id, filename, processing_status: "queued" }`
- **Poll Document Status**: `GET /api/documents/:id/status`
  - *Response*: `{ id, processing_status, structured_data, indexing_status, error_message }`

### Worker Process Architectures
- **Lightweight Built-In Queue**: Automatically included out-of-the-box (zero configuration needed).
- **Celery + Redis Distributed Worker**:
  1. **Redis Broker**: `redis-server` (Port `6379`)
  2. **Worker Process**: `python -m celery -A app.celery_app worker --loglevel=info`
  3. **FastAPI / Express Server**: Handles REST endpoints and dispatches task IDs via `.delay()`.
