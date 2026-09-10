from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from seed_data import seed_database
from routers import bidders

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-Powered GeM Bid Compliance Verification Engine",
    description="FastAPI Backend for Government Procurement Officer Bid Compliance Verification Hackathon Prototype",
    version="1.0.0"
)

# Enable CORS for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed Mock Government Database & Bidder records on startup
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

# Include Routers
app.include_router(bidders.router)

@app.get("/")
def read_root():
    return {
        "status": "active",
        "service": "AI-Powered GeM Bid Compliance Verification Platform",
        "role": "Government Procurement Officer Workspace",
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "SQLite (gem_compliance.db)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
