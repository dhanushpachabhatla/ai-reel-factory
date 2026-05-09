from typing import Literal

from pydantic import BaseModel, Field


ContentStatus = Literal["Idea", "Script", "Generated", "Edited", "Scheduled", "Posted"]


class Channel(BaseModel):
    id: str
    name: str
    niche: str
    audience: str
    tone: str
    contentPillars: list[str] = Field(default_factory=list)
    visualStyle: str
    forbiddenTopics: list[str] = Field(default_factory=list)
    postingFrequency: str


class ReelBrief(BaseModel):
    id: str
    channelId: str
    title: str
    hook: str
    script: str
    voiceover: str = ""
    storyboard: list[str] = Field(default_factory=list)
    visualPrompts: list[str]
    editingNotes: str
    caption: str
    hashtags: list[str]
    cta: str = ""
    status: ContentStatus
    scheduledDate: str
    format: str


class GenerateBatchRequest(BaseModel):
    channels: list[Channel]
    reelsPerChannel: int = Field(default=2, ge=1, le=10)


class GenerateBatchResponse(BaseModel):
    source: str
    briefs: list[ReelBrief]
    errors: list[str] = Field(default_factory=list)


class AnalyticsRecord(BaseModel):
    contentId: str
    views: int = Field(ge=0)
    likes: int = Field(ge=0)
    comments: int = Field(ge=0)
    shares: int = Field(ge=0)
    saves: int = Field(ge=0)
    avgWatchTime: float = Field(ge=0, le=100)


class ScoreResponse(BaseModel):
    contentId: str
    score: int
    label: str


class RecommendationRequest(BaseModel):
    briefs: list[ReelBrief]
    analytics: list[AnalyticsRecord]


class RecommendationResponse(BaseModel):
    source: str = "fallback"
    recommendations: list[str]
