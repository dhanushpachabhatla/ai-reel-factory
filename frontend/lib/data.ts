import { AnalyticsRecord, Channel, ReelBrief } from "./types";

export const channels: Channel[] = [
  {
    id: "fitness-myths",
    name: "AI Fitness Myths",
    niche: "faceless fitness education",
    audience: "18-30 year olds who want simple, evidence-aware fitness advice",
    tone: "direct, punchy, myth-busting",
    contentPillars: ["fat loss myths", "gym mistakes", "nutrition facts"],
    visualStyle: "bold captions, kinetic stock clips, simple diagrams",
    forbiddenTopics: ["medical claims", "extreme diets"],
    postingFrequency: "2 reels/day"
  },
  {
    id: "history-vault",
    name: "History Vault AI",
    niche: "mystery-led history shorts",
    audience: "curious viewers who like surprising historical facts",
    tone: "cinematic, tense, curiosity-driven",
    contentPillars: ["lost inventions", "ancient mysteries", "war decisions"],
    visualStyle: "archival images, AI recreations, film grain overlays",
    forbiddenTopics: ["graphic violence", "unverified conspiracy claims"],
    postingFrequency: "2 reels/day"
  },
  {
    id: "startup-signals",
    name: "Startup Signals",
    niche: "startup and AI business lessons",
    audience: "founders, builders, and students",
    tone: "sharp, analytical, practical",
    contentPillars: ["growth loops", "AI tools", "founder mistakes"],
    visualStyle: "screen captures, charts, clean subtitles",
    forbiddenTopics: ["investment advice", "fake revenue claims"],
    postingFrequency: "2 reels/day"
  },
  {
    id: "money-moves",
    name: "Money Moves Daily",
    niche: "personal finance explainers",
    audience: "young professionals learning money basics",
    tone: "clear, calm, tactical",
    contentPillars: ["budgeting", "credit", "side income"],
    visualStyle: "animated numbers, checklist overlays, desk B-roll",
    forbiddenTopics: ["guaranteed returns", "stock picks"],
    postingFrequency: "2 reels/day"
  },
  {
    id: "travel-loops",
    name: "Travel Loops",
    niche: "AI travel storytelling",
    audience: "travel dreamers and budget explorers",
    tone: "visual, aspirational, useful",
    contentPillars: ["hidden places", "budget routes", "culture facts"],
    visualStyle: "map motion, destination footage, warm captions",
    forbiddenTopics: ["unsafe travel claims", "staged reviews"],
    postingFrequency: "2 reels/day"
  },
  {
    id: "psychology-cues",
    name: "Psychology Cues",
    niche: "relationship and behavior psychology",
    audience: "young adults interested in practical social psychology",
    tone: "curious, grounded, emotionally sharp",
    contentPillars: ["conversation cues", "decision biases", "dating mistakes"],
    visualStyle: "minimal scenes, expressive captions, subtle motion graphics",
    forbiddenTopics: ["therapy claims", "manipulation advice"],
    postingFrequency: "2 reels/day"
  },
  {
    id: "movie-microfacts",
    name: "Movie Microfacts",
    niche: "film facts and behind-the-scenes stories",
    audience: "movie fans who enjoy surprising production trivia",
    tone: "entertaining, cinematic, fast",
    contentPillars: ["actor stories", "hidden details", "production mistakes"],
    visualStyle: "cinematic stills, quick zooms, bold lower-third captions",
    forbiddenTopics: ["copyrighted long clips", "unverified gossip"],
    postingFrequency: "2 reels/day"
  },
  {
    id: "health-simplified",
    name: "Health Simplified",
    niche: "general wellness explainers",
    audience: "busy professionals who want simple health habits",
    tone: "calm, practical, evidence-aware",
    contentPillars: ["sleep basics", "hydration myths", "stress habits"],
    visualStyle: "clean diagrams, soft lifestyle footage, checklist overlays",
    forbiddenTopics: ["diagnosis", "medical treatment advice"],
    postingFrequency: "2 reels/day"
  },
  {
    id: "ai-side-hustles",
    name: "AI Side Hustles",
    niche: "AI business and side income ideas",
    audience: "students and operators exploring AI-powered income streams",
    tone: "specific, tactical, realistic",
    contentPillars: ["service ideas", "automation workflows", "client acquisition"],
    visualStyle: "screen recordings, workflow diagrams, clean tool overlays",
    forbiddenTopics: ["income guarantees", "get-rich-quick claims"],
    postingFrequency: "2 reels/day"
  },
  {
    id: "food-science",
    name: "Food Science Bites",
    niche: "food myths and cooking science",
    audience: "home cooks who like practical kitchen experiments",
    tone: "playful, precise, useful",
    contentPillars: ["cooking myths", "ingredient science", "kitchen mistakes"],
    visualStyle: "macro food shots, stopwatch overlays, split-screen tests",
    forbiddenTopics: ["unsafe food handling", "medical nutrition claims"],
    postingFrequency: "2 reels/day"
  }
];

export const seedBriefs: ReelBrief[] = [
  {
    id: "brief-1",
    channelId: "fitness-myths",
    title: "The Cardio Myth That Slows Fat Loss",
    hook: "Doing more cardio is not always the fastest way to lose fat.",
    script:
      "Most people add more treadmill time when fat loss stalls. The real problem is usually energy balance, protein, sleep, and progressive training. Cardio helps, but it is the amplifier, not the engine. Fix the engine first.",
    voiceover:
      "Doing more cardio is not always the fastest way to lose fat. Cardio helps, but your real engine is energy balance, protein, sleep, and progressive training.",
    storyboard: [
      "0-2s: Treadmill close-up with hook overlay.",
      "2-8s: Split screen cardio vs strength training.",
      "8-20s: Three-part checklist: energy balance, protein, sleep.",
      "20-30s: Final takeaway with save CTA."
    ],
    visualPrompts: ["Split screen treadmill vs strength training", "Simple calorie balance diagram", "Protein meal close-up"],
    editingNotes: "Open with a hard cut and large caption. Add a progress bar and three fast examples.",
    caption: "Cardio helps, but it is not the whole system.",
    hashtags: ["#fitnessmyths", "#fatloss", "#gymtips"],
    cta: "Save this before your next cut.",
    status: "Scheduled",
    scheduledDate: "2026-05-10",
    format: "Myth bust"
  },
  {
    id: "brief-2",
    channelId: "startup-signals",
    title: "The AI Tool Stack A Solo Operator Actually Needs",
    hook: "Most AI stacks are bloated. A solo operator only needs five layers.",
    script:
      "You need a research layer, a generation layer, a database, a scheduler, and an analytics loop. The magic is not one tool. It is how each layer passes context to the next.",
    voiceover:
      "Most AI stacks are bloated. A solo operator only needs five layers: research, generation, database, scheduler, and analytics.",
    storyboard: [
      "0-2s: Messy tool stack visual.",
      "2-8s: Five-layer stack appears.",
      "8-20s: Each layer lights up in order.",
      "20-30s: Calendar fills with scheduled reels."
    ],
    visualPrompts: ["Five-layer stack diagram", "Dashboard screen capture", "Calendar filling with content cards"],
    editingNotes: "Use clean overlays and number each layer. End with a one-line framework.",
    caption: "AI leverage comes from workflows, not tool collecting.",
    hashtags: ["#aitools", "#startup", "#automation"],
    cta: "Comment 'stack' if you want the template.",
    status: "Posted",
    scheduledDate: "2026-05-08",
    format: "Framework"
  }
];

export const analytics: AnalyticsRecord[] = [
  {
    contentId: "brief-1",
    views: 41800,
    likes: 2150,
    comments: 96,
    shares: 550,
    saves: 730,
    avgWatchTime: 81
  },
  {
    contentId: "brief-2",
    views: 67400,
    likes: 3100,
    comments: 142,
    shares: 1200,
    saves: 980,
    avgWatchTime: 88
  }
];
