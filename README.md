# AI Reel Factory

An AI-first short-form content operating system prototype for the Matiks assignment.

The app is intentionally split into two parts:

- `frontend/`: Next.js operator console
- `backend/`: Python FastAPI AI content engine

This mirrors a scalable production setup where the UI manages review and workflow, while Python owns AI generation, scoring, RAG-ready services, and automation logic.

## File Structure

```text
ai-reel-factory/
  backend/
    app/
      core/
        config.py
      routers/
        analytics.py
        channels.py
        generate.py
      services/
        content_engine.py
        gemini_service.py
        mock_generator.py
        scoring.py
      main.py
      schemas.py
      seed.py
    .env.example
    requirements.txt

  frontend/
    app/
      globals.css
      layout.tsx
      page.tsx
    components/
      AnalyticsPanel.tsx
      ChannelCard.tsx
      MetricCard.tsx
      PipelineTable.tsx
    lib/
      data.ts
      mock-generator.ts
      scoring.ts
      types.ts
    .env.example
    package.json
```

## Run Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Optional Gemini setup:

```text
GEMINI_API_KEY=your_key_here
```

Add it to `backend/.env`.
For multiple keys, use:

```text
GEMINI_API_KEY1=your_first_key
GEMINI_API_KEY2=your_second_key
GEMINI_API_KEY3=your_third_key
GEMINI_MODEL=gemini-2.5-flash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional frontend env:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Backend API

```text
GET  /health
GET  /channels
GET  /content
GET  /analytics
POST /generate/batch
POST /analytics/score
POST /analytics/recommendations
```

## What It Demonstrates

- Multi-channel playbooks
- 1-click batch generation with Multi-Step "AI Thinking" Progress UI
- Python AI backend with Gemini integration
- Gemini key rotation with `GEMINI_API_KEY1`, `GEMINI_API_KEY2`, and `GEMINI_API_KEY3`
- Mock fallback when no API key is present
- Production-ready brief details: script, voiceover, storyboard, prompts, captions, hashtags, CTA, and editing notes
- **Operator Approval Workflow**: Review, Approve, or Reject & Regenerate briefs using actual Gemini API
- **In-App Video Preview**: A simulated 9:16 mobile player showing the script with animated kinetic captions
- Editable analytics scoring and Gemini-powered feedback loop
- CSV export for scheduler handoff
- Architecture ready for RAG, background jobs, media generation, and database persistence
- **Premium UI Overhaul**: Seamless Light/Dark mode, glassmorphism, gradient UI, and smooth micro-animations

## Assignment Report

The reverse-engineering writeup is here:

```text
docs/Matiks_Assignment_Report.md
```
