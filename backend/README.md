# Backend

FastAPI service for the AI Reel Factory content engine.

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Create `.env` from `.env.example` to enable Gemini.
