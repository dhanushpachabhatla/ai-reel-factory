from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import analytics, channels, generate
from app.seed import SEED_ANALYTICS, SEED_BRIEFS

settings = get_settings()

app = FastAPI(
    title="AI Reel Factory Backend",
    description="FastAPI content engine for multi-channel AI reel operations.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(channels.router)
app.include_router(generate.router)
app.include_router(analytics.router)


@app.get("/health")
def health():
    return {"status": "ok", "geminiKeysLoaded": len(settings.gemini_api_keys)}


@app.get("/content")
def list_content():
    return {"briefs": SEED_BRIEFS}


@app.get("/analytics")
def list_analytics():
    return {"analytics": SEED_ANALYTICS}
