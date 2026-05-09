from app.schemas import AnalyticsRecord, Channel, ReelBrief

CHANNELS = [
    Channel(
        id="fitness-myths",
        name="AI Fitness Myths",
        niche="faceless fitness education",
        audience="18-30 year olds who want simple, evidence-aware fitness advice",
        tone="direct, punchy, myth-busting",
        contentPillars=["fat loss myths", "gym mistakes", "nutrition facts"],
        visualStyle="bold captions, kinetic stock clips, simple diagrams",
        forbiddenTopics=["medical claims", "extreme diets"],
        postingFrequency="2 reels/day",
    ),
    Channel(
        id="history-vault",
        name="History Vault AI",
        niche="mystery-led history shorts",
        audience="curious viewers who like surprising historical facts",
        tone="cinematic, tense, curiosity-driven",
        contentPillars=["lost inventions", "ancient mysteries", "war decisions"],
        visualStyle="archival images, AI recreations, film grain overlays",
        forbiddenTopics=["graphic violence", "unverified conspiracy claims"],
        postingFrequency="2 reels/day",
    ),
    Channel(
        id="startup-signals",
        name="Startup Signals",
        niche="startup and AI business lessons",
        audience="founders, builders, and students",
        tone="sharp, analytical, practical",
        contentPillars=["growth loops", "AI tools", "founder mistakes"],
        visualStyle="screen captures, charts, clean subtitles",
        forbiddenTopics=["investment advice", "fake revenue claims"],
        postingFrequency="2 reels/day",
    ),
    Channel(
        id="money-moves",
        name="Money Moves Daily",
        niche="personal finance explainers",
        audience="young professionals learning money basics",
        tone="clear, calm, tactical",
        contentPillars=["budgeting", "credit", "side income"],
        visualStyle="animated numbers, checklist overlays, desk B-roll",
        forbiddenTopics=["guaranteed returns", "stock picks"],
        postingFrequency="2 reels/day",
    ),
    Channel(
        id="ai-side-hustles",
        name="AI Side Hustles",
        niche="AI business and side income ideas",
        audience="students and operators exploring AI-powered income streams",
        tone="specific, tactical, realistic",
        contentPillars=["service ideas", "automation workflows", "client acquisition"],
        visualStyle="screen recordings, workflow diagrams, clean tool overlays",
        forbiddenTopics=["income guarantees", "get-rich-quick claims"],
        postingFrequency="2 reels/day",
    ),
]

SEED_BRIEFS = [
    ReelBrief(
        id="brief-1",
        channelId="fitness-myths",
        title="The Cardio Myth That Slows Fat Loss",
        hook="Doing more cardio is not always the fastest way to lose fat.",
        script=(
            "Most people add more treadmill time when fat loss stalls. The real problem is usually "
            "energy balance, protein, sleep, and progressive training. Cardio helps, but it is the "
            "amplifier, not the engine. Fix the engine first."
        ),
        voiceover=(
            "Doing more cardio is not always the fastest way to lose fat. Cardio helps, but your real "
            "engine is nutrition, protein, sleep, and progressive training."
        ),
        storyboard=[
            "0-2s: Treadmill close-up with hook overlay.",
            "2-8s: Split screen cardio vs strength training.",
            "8-20s: Three-part checklist: energy balance, protein, sleep.",
            "20-30s: Final takeaway with save CTA.",
        ],
        visualPrompts=[
            "Split screen treadmill vs strength training",
            "Simple calorie balance diagram",
            "Protein meal close-up",
        ],
        editingNotes="Open with a hard cut and large caption. Add a progress bar and three fast examples.",
        caption="Cardio helps, but it is not the whole system.",
        hashtags=["#fitnessmyths", "#fatloss", "#gymtips"],
        cta="Save this before your next cut.",
        status="Scheduled",
        scheduledDate="2026-05-10",
        format="Myth bust",
    )
]

SEED_ANALYTICS = [
    AnalyticsRecord(
        contentId="brief-1",
        views=41800,
        likes=2150,
        comments=96,
        shares=550,
        saves=730,
        avgWatchTime=81,
    )
]
