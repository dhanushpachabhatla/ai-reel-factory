from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings
from app.schemas import AnalyticsRecord, RecommendationRequest, RecommendationResponse, ScoreResponse
from app.services.content_engine import recommend_next_batch
from app.services.scoring import performance_label, performance_score

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.post("/score", response_model=ScoreResponse)
def score_content(record: AnalyticsRecord):
    score = performance_score(record)
    return ScoreResponse(contentId=record.contentId, score=score, label=performance_label(score))


@router.post("/recommendations", response_model=RecommendationResponse)
def recommendations(
    request: RecommendationRequest,
    settings: Settings = Depends(get_settings),
):
    source, recommendations = recommend_next_batch(settings, request.briefs, request.analytics)
    return RecommendationResponse(source=source, recommendations=recommendations)
