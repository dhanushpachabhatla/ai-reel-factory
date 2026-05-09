# AI Reel Factory

An AI-first short-form content operating system prototype for the Matiks assignment.

The app is intentionally split into two parts:

- `frontend/`: Next.js operator console
- `backend/`: Python FastAPI AI content engine

This mirrors a scalable production setup where the UI manages review and workflow, while Python owns AI generation, scoring, RAG-ready services, and automation logic.

## Demo Video Link - https://drive.google.com/file/d/1VfIjf4MkpRBUdI2uLk_oQhVVKrBDWFJb/view?usp=sharing


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

## Assignment Report: Reverse Engineering & Strategy

### Thesis

Matiks does not need a content creator workflow. It needs an AI-first operating system where one operator manages channel strategy, quality control, and performance feedback while the system handles research, scripting, production briefs, scheduling assets, and analytics loops.

The prototype in this repo automates one high-leverage bottleneck: generating production-ready reel briefs across multiple niches and feeding performance data back into the next batch.

### Reverse Engineering 1: Faceless AI Content Machine

**Example Analyzed**
Faceless AI short-form systems such as AutoReels and FacelessReels show the shape of a scalable faceless content machine. AutoReels describes a pipeline that writes scripts, sources visuals, records voiceover, animates captions, and publishes to YouTube Shorts, TikTok, and Instagram. Its feature stack includes GPT-4o-style scripting, stock footage from Pexels/Pixabay, ElevenLabs-style voiceover, animated captions, music, multi-platform export, auto-publishing, Runway/Kling visuals, and recurring content series. FacelessReels positions itself similarly: AI-generated and auto-posted faceless videos for niches such as mythology, school gossip, scary stories, history, biblical stories, anime stories, and heists.

Sources:
- [AutoReels](https://autoreels.fastlab.ai/)
- [FacelessReels](https://www.facelessreels.com/)

**Likely Workflow**
```text
Niche/channel playbook
→ topic or trend input
→ hook-first script generation
→ scene-by-scene storyboard
→ stock/AI visual selection
→ voiceover generation
→ caption animation
→ music selection
→ 9:16 export
→ scheduled publishing
→ analytics capture
→ repeat winning formats
```

**Likely Tools**
```text
Research: TikTok/Instagram scraping, Google Trends, Reddit, YouTube Shorts, Perplexity
Scripting: Gemini, GPT-4o, Claude
Voice: ElevenLabs, PlayHT, TikTok TTS
Visuals: Pexels, Pixabay, Runway, Kling, Pika
Editing: CapCut templates, Remotion, Creatomate, ffmpeg
Publishing: Meta Business Suite, Buffer, Metricool, Later
Data: Airtable, Supabase, Sheets, Postgres
Automation: n8n, Make, cron jobs, queue workers
```

**Bottlenecks**
- Repeatedly finding topics that fit each niche
- Making hooks specific enough to earn retention
- Avoiding repetitive AI-looking visuals
- Matching voice, captions, and pacing to niche identity
- Managing many scheduled assets without losing status visibility
- Turning analytics into concrete next-batch decisions

**How To Recreate Internally**
Create a channel playbook for every account:
```text
Niche, Audience, Tone, Content pillars, Forbidden topics, Visual style, Hook patterns, CTA style, Posting cadence, Performance benchmarks
```

Then run a batch engine:
```text
10 channels × 2 reels/day
→ generate 20 briefs
→ operator reviews exceptions
→ video tools render from prompts/storyboards
→ scheduler posts
→ analytics engine scores
→ next batch uses winning hooks/formats
```

### Reverse Engineering 2: AI UGC/Reels Brand Machine

**Example Analyzed**
Arcads is an AI UGC ad platform for virtual-actor video advertising. A public case study reports that better voice generation enabled authentic UGC-style ads in 30 languages, with 10x creation speed and 1B+ ad impressions. The same case study frames the core problem clearly: social ads need authenticity, and the voice must match the emotional feel of the visual. A separate DTC skincare AI UGC case study from ppl.studio describes a brand replacing slow creator workflows with AI-generated persona-based assets, producing 500+ photos in two weeks and saving thousands in monthly creator fees.

Sources:
- [Arcads voiceover case study](https://www.contextwindows.ai/case-study/arcads-video-ad-voiceovers)
- [ppl.studio DTC skincare case study](https://ppl.studio/case-studies/dtc-skincare-brand-scales-ugc)

**Likely Workflow**
```text
Product / offer / landing page
→ customer pain point research
→ ad angle generation
→ UGC script variants
→ virtual actor / AI persona selection
→ voiceover generation
→ video assembly
→ creative variant export
→ paid social testing
→ CPA/CTR/ROAS analysis
→ winning angle expansion
```

**Likely Tools**
```text
Research: ad libraries, comments, reviews, competitor pages
Scripting: Gemini/GPT/Claude with angle libraries
UGC actor: Arcads, HeyGen, Synthesia, Captions AI
Voice: ElevenLabs or native avatar voice
Editing: template renderer, CapCut, Creatomate, Remotion
Testing: Meta Ads, TikTok Ads
Analytics: ad account exports, Sheets, Looker Studio, Postgres
Automation: n8n/Make + scheduled batch jobs
```

**Bottlenecks**
- Generating enough high-quality ad angles
- Keeping AI UGC believable instead of synthetic
- Matching voice, avatar, demographic, and offer
- Producing enough variants before creative fatigue
- Linking ad performance back to creative features

**Internal Recreation**
For Matiks-style content channels, the equivalent is:
```text
Channel playbook
→ content angle library
→ hook variant generator
→ production brief generator
→ video/voice pipeline
→ post scheduler
→ analytics scorer
→ winner expansion engine
```

The operator does not make every piece. The operator tunes playbooks, reviews flagged outputs, and makes final quality decisions.

### Scaling Logic for the Prototype

For 10 channels at 2 reels/day:
```text
10 channel playbooks × 2 reels per day = 20 production-ready briefs per day
```

The operator reviews:
```text
flagged scripts, brand-safety issues, weak hooks, final video output, weekly analytics, channel playbook updates
```

The system handles:
```text
batch generation, script variation, storyboard generation, caption/hashtag creation, calendar handoff, analytics scoring, next-batch recommendation
```
