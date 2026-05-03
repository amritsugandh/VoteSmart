import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import auth, auth_me, chat, feedback, registration

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VoteSmart India API",
    description="Backend API for the VoteSmart India Election Portal",
    version="1.0.0"
)

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api")
app.include_router(auth_me.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(registration.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "VoteSmart India API is running", "version": "1.0.0"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}
